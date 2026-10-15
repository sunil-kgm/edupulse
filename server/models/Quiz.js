const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    marks: { type: Number, default: 1 },
  }],
  duration: { type: Number, default: 30 }, // minutes
  maxScore: { type: Number, default: 100 },
  dueDate: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const quizAttemptSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ questionIndex: Number, selectedAnswer: Number }],
  score: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'completed', 'missed'], default: 'pending' },
  submittedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = {
  Quiz: mongoose.model('Quiz', quizSchema),
  QuizAttempt: mongoose.model('QuizAttempt', quizAttemptSchema),
};
