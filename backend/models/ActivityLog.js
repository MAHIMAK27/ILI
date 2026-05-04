const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String }
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
