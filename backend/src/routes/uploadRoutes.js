const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const upload = require('../middlewares/upload');
const authMiddleware = require('../middlewares/authMiddleware');
const Upload = require('../models/Upload');
const Prediction = require('../models/Prediction');
const router = express.Router();

// Helper function to safely parse numbers
const parseNum = (val) => {
  const parsed = parseFloat(val);
  return isNaN(parsed) ? null : parsed;
};

router.post('/', authMiddleware, upload.single('dataset'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('[DEBUG] File received:', req.file.filename);

    // 1. Create Upload Record
    const newUpload = new Upload({
      fileId: req.file.filename,
      originalName: req.file.originalname,
      status: 'processing',
      uploadedBy: req.user.id
    });
    await newUpload.save();
    console.log('[DEBUG] Upload record created:', newUpload._id);

    // 2. Parse CSV
    console.log('[DEBUG] CSV parsing started');
    const results = [];
    
    await new Promise((resolve, reject) => {
      let rowCount = 0;
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
          rowCount++;
          console.log(`[DEBUG] Parsed row ${rowCount}`);
          // Convert string values to appropriate types for ML service
          const processedRow = {
            date: data.date,
            state: data.state,
            district: data.district,
            region_code: data.region_code,
            fever_count: parseNum(data.fever_count),
            cough_count: parseNum(data.cough_count),
            sore_throat_count: parseNum(data.sore_throat_count),
            shortness_of_breath_count: parseNum(data.shortness_of_breath_count),
            population_density: parseNum(data.population_density),
            ili_cases_confirmed: parseNum(data.ili_cases_confirmed),
          };
          // Clean out nulls if column was missing
          Object.keys(processedRow).forEach(key => processedRow[key] === null && delete processedRow[key]);
          results.push(processedRow);
        })
        .on('end', () => {
          console.log('[DEBUG] CSV parsing completed');
          resolve();
        })
        .on('error', (err) => {
          console.error('[DEBUG] CSV parsing error:', err.message);
          reject(err);
        });
    });

    console.log('[DEBUG] Number of parsed records:', results.length);

    // 3. Send to Flask ML API
    console.log('[DEBUG] Preparing ML payload');
    const mlUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5001/predict';
    console.log('[DEBUG] ML_SERVICE_URL is:', mlUrl);
    
    console.log('[DEBUG] Calling Flask API');
    const mlResponse = await axios.post(mlUrl, { records: results });
    console.log('[DEBUG] Flask response received with status:', mlResponse.status);
    
    if (mlResponse.data.status !== 'success') {
      throw new Error('ML Pipeline failed to process data');
    }

    // 4. Save Predictions
    console.log('[DEBUG] Prediction documents prepared');
    const predictions = mlResponse.data.predictions;
    
    const predictionDocs = predictions.map((pred, i) => ({
      uploadId: newUpload._id,
      date: new Date(pred.date),
      state: results[i].state || 'Unknown',
      district: results[i].district || 'Unknown',
      region_code: results[i].region_code || 'UNK',
      fever_count: results[i].fever_count || 0,
      cough_count: results[i].cough_count || 0,
      sore_throat_count: results[i].sore_throat_count || 0,
      shortness_of_breath_count: results[i].shortness_of_breath_count || 0,
      population_density: results[i].population_density || 0,
      ili_cases_confirmed: results[i].ili_cases_confirmed || 0,
      predicted_cases: pred.predicted_cases,
      risk_score: pred.risk_score
    }));

    await Prediction.insertMany(predictionDocs);
    console.log('[DEBUG] MongoDB insert completed');

    // 5. Update Upload Status and Schema
    if (results.length > 0) {
      const hasGeo = results.some(r => r.state || r.district || r.region_code || r.latitude || r.longitude);
      newUpload.datasetType = hasGeo ? 'Geographic Dataset' : 'Trend Dataset';
    } else {
      newUpload.datasetType = 'Unknown';
    }
    newUpload.status = 'completed';
    await newUpload.save();

    // 6. Return Success
    console.log('[DEBUG] Response returned');
    res.json({
      message: 'Data uploaded and predictions generated successfully.',
      fileId: newUpload.fileId,
      datasetType: newUpload.datasetType,
      predictionsCount: predictionDocs.length
    });

  } catch (error) {
    console.error('[DEBUG] Caught error in pipeline:', error.message);
    next(error);
  }
});

module.exports = router;
