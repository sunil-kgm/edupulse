const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  maxScore: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const assignmentSubmissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'submitted', 'incomplete', 'overdue', 'missed'], default: 'pending' },
  score: { type: Number, default: null },
  submittedAt: { type: Date, default: null },
  feedback: { type: String, default: '' },
}, { timestamps: true });

module.exports = {
  Assignment: mongoose.model('Assignment', assignmentSchema),
  AssignmentSubmission: mongoose.model('AssignmentSubmission', assignmentSubmissionSchema),
};
