const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['completed', 'current', 'pending'], default: 'pending' },
  dueDate: { type: Date },
  completedAt: { type: Date },
  order: { type: Number, required: true },
});

const recoveryPathSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  riskFlag: { type: mongoose.Schema.Types.ObjectId, ref: 'RiskFlag', required: true },
  milestones: [milestoneSchema],
  progressPercent: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
  completedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('RecoveryPath', recoveryPathSchema);
