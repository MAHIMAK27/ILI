const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Prediction = require('../models/Prediction');
const Upload = require('../models/Upload');
const router = express.Router();

const STATE_COORDS = {
  'Delhi': [28.6139, 77.2090],
  'Maharashtra': [19.7515, 75.7139],
  'Karnataka': [15.3173, 75.7139],
  'Kerala': [10.8505, 76.2711],
  'West Bengal': [22.9868, 87.8550],
  'Tamil Nadu': [11.1271, 78.6569],
  'Telangana': [18.1124, 79.0193],
  'Gujarat': [22.2587, 71.1924],
  'Rajasthan': [27.0238, 74.2179],
  'Uttar Pradesh': [26.8467, 80.9462],
  // Add fallback coords generator
};

const getCoords = (stateName) => {
  if (!stateName) return [22.0, 78.0];
  if (STATE_COORDS[stateName]) return STATE_COORDS[stateName];
  // fallback somewhere in central india slightly jittered based on string length
  return [22.0 + (stateName.length % 5), 78.0 + (stateName.length % 5)];
};

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const latestUpload = await Upload.findOne({ status: 'completed' }).sort({ createdAt: -1 });
    if (latestUpload && latestUpload.datasetType === 'Trend Dataset') {
      return res.status(400).json({ error: 'Geographical analytics are disabled for Trend Datasets.' });
    }

    const mapAggr = await Prediction.aggregate([
      {
        $group: {
          _id: "$state",
          riskScore: { $avg: "$risk_score" },
          cases: { $sum: "$predicted_cases" },
          timestamp: { $max: "$createdAt" }
        }
      },
      { $match: { _id: { $nin: [null, 'Unknown'] } } }
    ]);

    const mapData = mapAggr.map(r => ({
      state: r._id,
      latitude: getCoords(r._id)[0],
      longitude: getCoords(r._id)[1],
      riskScore: Math.round(r.riskScore),
      cases: Math.round(r.cases),
      uploadTimestamp: r.timestamp
    }));

    res.json(mapData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
