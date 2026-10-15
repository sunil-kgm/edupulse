const mongoose = require('mongoose');

const facultyReportSchema = new mongoose.Schema({
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  concernType: {
    type: String,
    enum: [
      'incomplete_assignment', 'missing_assignment', 'missing_test',
      'low_quiz_performance', 'low_academic_performance', 'low_attendance',
      'repeated_incomplete_work', 'other'
    ],
    required: true
  },
  description: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
  parentAcknowledged: { type: Boolean, default: false },
  acknowledgedAt: { type: Date, default: null },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('FacultyReport', facultyReportSchema);
