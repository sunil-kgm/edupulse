const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semester: { type: Number, required: true },
  year: { type: Number, required: true },
  credits: { type: Number, default: 4 },
  description: { type: String, default: '' },
  modules: [{
    title: String,
    description: String,
    order: Number,
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LearningResource' }]
  }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
