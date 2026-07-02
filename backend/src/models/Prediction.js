const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  uploadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Upload',
    required: false
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  fever_count: {
    type: Number,
    min: 0,
    required: true
  },
  cough_count: {
    type: Number,
    min: 0,
    required: true
  },
  sore_throat_count: {
    type: Number,
    min: 0,
    default: 0
  },
  shortness_of_breath_count: {
    type: Number,
    min: 0,
    default: 0
  },
  state: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  region_code: {
    type: String,
    trim: true
  },
  population_density: {
    type: Number,
    min: 0
  },
  ili_cases_confirmed: {
    type: Number,
    min: 0
  },
  predicted_cases: {
    type: Number,
    min: 0,
    required: true
  },
  risk_score: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  }
}, { timestamps: true });

predictionSchema.index({ date: 1 });
predictionSchema.index({ risk_score: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);
