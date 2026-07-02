const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Prediction = require('../models/Prediction');
const Upload = require('../models/Upload');
const router = express.Router();

router.get('/:state', authMiddleware, async (req, res, next) => {
  try {
    const latestUpload = await Upload.findOne({ status: 'completed' }).sort({ createdAt: -1 });
    if (latestUpload && latestUpload.datasetType === 'Trend Dataset') {
      return res.status(400).json({ error: 'Geographical analytics are disabled for Trend Datasets.' });
    }

    const { state } = req.params;

    const insightsAggr = await Prediction.aggregate([
      { $match: { state: state } },
      {
        $group: {
          _id: null,
          totalCases: { $sum: "$predicted_cases" },
          avgRisk: { $avg: "$risk_score" },
          totalFever: { $sum: "$fever_count" },
          totalCough: { $sum: "$cough_count" },
          totalSoreThroat: { $sum: "$sore_throat_count" },
          totalShortnessOfBreath: { $sum: "$shortness_of_breath_count" },
          lastPredictionDate: { $max: "$date" }
        }
      }
    ]);

    if (insightsAggr.length === 0) {
      return res.status(404).json({ message: 'No data for this state' });
    }

    const stats = insightsAggr[0];

    // Determine dominant symptom
    const symptoms = [
      { name: 'Fever', count: stats.totalFever },
      { name: 'Cough', count: stats.totalCough },
      { name: 'Sore Throat', count: stats.totalSoreThroat },
      { name: 'Shortness of Breath', count: stats.totalShortnessOfBreath }
    ].sort((a, b) => b.count - a.count);
    
    const dominantSymptom = symptoms[0].name;
    const secondDominant = symptoms[1].name;

    // Weekly trend
    const trendAggr = await Prediction.aggregate([
      { $match: { state: state } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            week: { $isoWeek: "$date" }
          },
          fever: { $sum: "$fever_count" },
          cough: { $sum: "$cough_count" },
          soreThroat: { $sum: "$sore_throat_count" },
          actual: { $sum: "$ili_cases_confirmed" },
          predicted: { $sum: "$predicted_cases" }
        }
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } },
      { $limit: 10 }
    ]);

    const weeklyTrend = trendAggr.map(t => ({
      week: `W${t._id.week}`,
      fever: Math.round(t.fever),
      cough: Math.round(t.cough),
      soreThroat: Math.round(t.soreThroat),
      actual: Math.round(t.actual),
      predicted: Math.round(t.predicted)
    }));

    res.json({
      predictedCases: Math.round(stats.totalCases),
      averageRisk: Math.round(stats.avgRisk),
      dominantSymptom: `${dominantSymptom} & ${secondDominant}`,
      weeklyTrend,
      predictionVsActual: weeklyTrend, // Can use the same data array since it contains both
      confidenceInterval: '95%',
      lastPredictionDate: stats.lastPredictionDate
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
