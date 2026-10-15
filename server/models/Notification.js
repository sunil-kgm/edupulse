const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['low_performance', 'incomplete_assignment', 'attendance_alert', 'faculty_report',
           'recovery_progress', 'risk_flag', 'acknowledgement', 'general'],
    default: 'general'
  },
  isRead: { type: Boolean, default: false },
  relatedReport: { type: mongoose.Schema.Types.ObjectId, ref: 'FacultyReport' },
  relatedStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actionUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
