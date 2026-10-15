const mongoose = require('mongoose');

const learningResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  type: { type: String, enum: ['video', 'pdf', 'article', 'quiz_set', 'practice'], default: 'article' },
  url: { type: String, default: '' },
  description: { type: String, default: '' },
  rating: { type: Number, default: 4.0 },
  tags: [String],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('LearningResource', learningResourceSchema);
