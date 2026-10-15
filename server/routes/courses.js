const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Course = require('../models/Course');
const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { faculty, student } = req.query;
    let filter = { isActive: true };
    if (faculty) filter.faculty = faculty;
    const courses = await Course.find(filter).populate('faculty', 'name email').populate('department', 'name');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('faculty', 'name email').populate('department', 'name');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authorize('admin', 'hod', 'faculty'), async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
