const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const RiskFlag = require('../models/RiskFlag');
const Notification = require('../models/Notification');
const User = require('../models/User');
const router = express.Router();

router.use(protect);

// Get risk flags for student
router.get('/student/:studentId', async (req, res) => {
  try {
    const flags = await RiskFlag.find({ student: req.params.studentId, isActive: true }).sort({ createdAt: -1 });
    res.json(flags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all at-risk students (faculty/hod/admin)
router.get('/all', authorize('faculty', 'hod', 'admin'), async (req, res) => {
  try {
    const flags = await RiskFlag.find({ isActive: true })
      .populate('student', 'name email rollNumber class department')
      .sort({ level: -1, createdAt: -1 });
    res.json(flags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Detect and create/update risk (called programmatically)
router.post('/detect/:studentId', authorize('faculty', 'admin', 'hod'), async (req, res) => {
  try {
    const { attendancePercent, assignmentCompletionPercent, quizAveragePercent } = req.body;
    const reasons = [];
    let level = null;
    
    if (attendancePercent < 75) reasons.push(`Attendance: ${attendancePercent}%`);
    if (quizAveragePercent < 50) reasons.push(`Quiz Average: ${quizAveragePercent}%`);
    if (assignmentCompletionPercent < 60) reasons.push(`Assignment Completion: ${assignmentCompletionPercent}%`);
    
    if (reasons.length === 0) level = null;
    else if (reasons.length === 1 && attendancePercent > 65 && quizAveragePercent > 40 && assignmentCompletionPercent > 50) level = 'low';
    else if (reasons.length <= 2) level = 'medium';
    else level = 'high';
    
    if (!level) return res.json({ message: 'No risk detected', level: null });
    
    // Deactivate old flags
    await RiskFlag.updateMany({ student: req.params.studentId, isActive: true }, { isActive: false });
    
    const flag = await RiskFlag.create({
      student: req.params.studentId,
      level, reasons,
      attendancePercent, assignmentCompletionPercent, quizAveragePercent,
    });
    
    // Notify student
    const student = await User.findById(req.params.studentId);
    await Notification.create({
      recipient: req.params.studentId,
      title: `Risk Flag: ${level.charAt(0).toUpperCase() + level.slice(1)} Risk Detected`,
      message: `Your academic risk level has been flagged as ${level}. Reasons: ${reasons.join(', ')}`,
      type: 'risk_flag',
    });
    
    // Notify parent
    if (student && student.parentId) {
      await Notification.create({
        recipient: student.parentId,
        title: `Academic Alert for ${student.name}`,
        message: `Your ward's academic risk level has been flagged as ${level}. Reasons: ${reasons.join(', ')}`,
        type: 'risk_flag',
        relatedStudent: req.params.studentId,
      });
    }
    
    res.json(flag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
