const mongoose = require('mongoose');

const parentAcknowledgementSchema = new mongoose.Schema({
  report: { type: mongoose.Schema.Types.ObjectId, ref: 'FacultyReport', required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  acknowledgedAt: { type: Date, required: true },
  status: { type: String, enum: ['acknowledged', 'pending'], default: 'acknowledged' },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('ParentAcknowledgement', parentAcknowledgementSchema);
