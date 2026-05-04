const mongoose = require('mongoose');

const DatasetSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Completed', 'Error'], 
    default: 'Pending' 
  },
  recordCount: { type: Number, default: 0 },
  fileSize: { type: Number }
});

module.exports = mongoose.model('Dataset', DatasetSchema);
