const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const RiskFlag = require('../models/RiskFlag');
const { Assignment, AssignmentSubmission } = require('../models/Assignment');
const Attendance = require('../models/Attendance');
const { QuizAttempt } = require('../models/Quiz');
const FacultyReport = require('../models/FacultyReport');
const router = express.Router();

router.use(protect);

// Department analytics for HoD/Admin
router.get('/department', authorize('hod', 'admin'), async (req, res) => {
  try {
    const { departmentId } = req.query;
    const filter = departmentId ? { department: departmentId } : {};
    
    const totalStudents = await User.countDocuments({ role: 'student', ...filter });
    const totalFaculty = await User.countDocuments({ role: 'faculty', ...filter });
    const atRiskStudents = await RiskFlag.countDocuments({ isActive: true });
    const pendingReports = await FacultyReport.countDocuments({ parentAcknowledged: false });
    
    res.json({ totalStudents, totalFaculty, atRiskStudents, pendingReports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Student analytics summary
router.get('/student/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    
    const submissions = await AssignmentSubmission.find({ student: studentId });
    const totalAssignments = submissions.length;
    const completedAssignments = submissions.filter(s => s.status === 'submitted').length;
    const assignmentCompletion = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;
    
    const attempts = await QuizAttempt.find({ student: studentId, status: 'completed' });
    const quizAverage = attempts.length > 0 
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length) : 0;
    
    const attendanceRecords = await Attendance.find({ student: studentId });
    const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
    const attendancePercent = attendanceRecords.length > 0 
      ? Math.round((presentCount / attendanceRecords.length) * 100) : 0;
    
    const riskFlag = await RiskFlag.findOne({ student: studentId, isActive: true });
    
    res.json({ assignmentCompletion, quizAverage, attendancePercent, riskFlag });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
