const mongoose = require('mongoose');

const riskFlagSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  level: { type: String, enum: ['low', 'medium', 'high'], required: true },
  reasons: [String],
  attendancePercent: { type: Number },
  assignmentCompletionPercent: { type: Number },
  quizAveragePercent: { type: Number },
  isActive: { type: Boolean, default: true },
  resolvedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('RiskFlag', riskFlagSchema);
