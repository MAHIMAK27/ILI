const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  fileId: {
    type: String,
    required: [true, 'File ID is required'],
    unique: true
  },
  originalName: {
    type: String,
    required: [true, 'Original file name is required']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  datasetType: {
    type: String,
    enum: ['Trend Dataset', 'Geographic Dataset', 'Unknown'],
    default: 'Unknown'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, { timestamps: true });

// Removed duplicate fileId index as unique: true handles it automatically
uploadSchema.index({ status: 1 });

module.exports = mongoose.model('Upload', uploadSchema);
