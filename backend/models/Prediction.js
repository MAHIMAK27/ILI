const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  datasetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset' },
  date: { type: Date, required: true },
  region: { type: String },
  state: { type: String },
  predictedRiskScore: { type: Number, required: true },
  riskLevel: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'] 
  },
  symptomSeverityScore: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
