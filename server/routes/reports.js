const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const FacultyReport = require('../models/FacultyReport');
const ParentAcknowledgement = require('../models/ParentAcknowledgement');
const Notification = require('../models/Notification');
const User = require('../models/User');
const router = express.Router();

router.use(protect);

// Get reports (faculty sees their own, parent sees student's, student sees own)
router.get('/', async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'faculty') filter.faculty = req.user._id;
    else if (req.user.role === 'student') filter.student = req.user._id;
    else if (req.user.role === 'parent') {
      const parent = await User.findById(req.user._id);
      filter.student = { $in: parent.linkedStudents };
    }
    
    const reports = await FacultyReport.find(filter)
      .populate('faculty', 'name email')
      .populate('student', 'name email rollNumber class')
      .populate('course', 'name code')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single report
router.get('/:id', async (req, res) => {
  try {
    const report = await FacultyReport.findById(req.params.id)
      .populate('faculty', 'name email')
      .populate('student', 'name email rollNumber class')
      .populate('course', 'name code');
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create faculty report
router.post('/', authorize('faculty', 'admin'), async (req, res) => {
  try {
    const report = await FacultyReport.create({ ...req.body, faculty: req.user._id });
    
    // Get student and parent
    const student = await User.findById(req.body.student);
    
    // Notify student
    await Notification.create({
      recipient: req.body.student,
      title: 'New Faculty Report',
      message: `A new academic concern has been reported by your faculty regarding ${req.body.concernType.replace(/_/g, ' ')}.`,
      type: 'faculty_report',
      relatedReport: report._id,
    });
    
    // Notify parent
    if (student && student.parentId) {
      await Notification.create({
        recipient: student.parentId,
        title: 'Faculty Academic Report',
        message: `A faculty member has submitted a new academic concern regarding your ward ${student.name}.`,
        type: 'faculty_report',
        relatedReport: report._id,
        relatedStudent: student._id,
      });
    }
    
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Parent acknowledge report
router.post('/:id/acknowledge', authorize('parent'), async (req, res) => {
  try {
    const report = await FacultyReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    if (report.parentAcknowledged) return res.status(400).json({ message: 'Already acknowledged' });
    
    const now = new Date();
    report.parentAcknowledged = true;
    report.acknowledgedAt = now;
    report.parentId = req.user._id;
    await report.save();
    
    const ack = await ParentAcknowledgement.create({
      report: report._id,
      parent: req.user._id,
      student: report.student,
      acknowledgedAt: now,
      status: 'acknowledged',
    });
    
    // Notify faculty
    await Notification.create({
      recipient: report.faculty,
      title: 'Report Acknowledged by Parent',
      message: `Parent has acknowledged the academic report you submitted.`,
      type: 'acknowledgement',
      relatedReport: report._id,
    });
    
    res.json({ report, acknowledgement: ack });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get acknowledgement history for parent
router.get('/acknowledgements/history', authorize('parent'), async (req, res) => {
  try {
    const acks = await ParentAcknowledgement.find({ parent: req.user._id })
      .populate({ path: 'report', populate: [{ path: 'faculty', select: 'name' }, { path: 'course', select: 'name' }] })
      .sort({ createdAt: -1 });
    res.json(acks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
