const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { Assignment, AssignmentSubmission } = require('../models/Assignment');
const router = express.Router();

router.use(protect);

// Get assignments for student
router.get('/student/:studentId', async (req, res) => {
  try {
    const submissions = await AssignmentSubmission.find({ student: req.params.studentId })
      .populate({ path: 'assignment', populate: { path: 'course', select: 'name code' } });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get assignments by course
router.get('/course/:courseId', async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId, isActive: true })
      .populate('course', 'name code');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit assignment
router.post('/:assignmentId/submit', authorize('student'), async (req, res) => {
  try {
    const submission = await AssignmentSubmission.findOneAndUpdate(
      { assignment: req.params.assignmentId, student: req.user._id },
      { status: 'submitted', submittedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create assignment (faculty)
router.post('/', authorize('faculty', 'admin', 'hod'), async (req, res) => {
  try {
    const assignment = await Assignment.create({ ...req.body, faculty: req.user._id });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
