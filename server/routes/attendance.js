const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const router = express.Router();

router.use(protect);

router.get('/student/:studentId', async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.params.studentId })
      .populate('course', 'name code').sort({ date: -1 });
    
    // Calculate summary per course
    const courseSummary = {};
    records.forEach(r => {
      const cId = r.course._id.toString();
      if (!courseSummary[cId]) {
        courseSummary[cId] = { course: r.course, total: 0, present: 0, absent: 0, late: 0 };
      }
      courseSummary[cId].total++;
      courseSummary[cId][r.status]++;
    });
    
    const summary = Object.values(courseSummary).map(s => ({
      ...s,
      percentage: Math.round((s.present + s.late * 0.5) / s.total * 100),
    }));
    
    res.json({ records, summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/mark', authorize('faculty', 'admin'), async (req, res) => {
  try {
    const { studentId, courseId, date, status } = req.body;
    const record = await Attendance.findOneAndUpdate(
      { student: studentId, course: courseId, date: new Date(date) },
      { status, markedBy: req.user._id },
      { new: true, upsert: true }
    );
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
