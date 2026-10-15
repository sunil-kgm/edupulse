const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

router.use(protect);

// Get all users (admin/hod/faculty)
router.get('/', authorize('admin', 'hod', 'faculty'), async (req, res) => {
  try {
    const { role, department } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (department) filter.department = department;
    const users = await User.find(filter).select('-password').populate('department', 'name code');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('department', 'name code');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get students for parent
router.get('/parent/students', authorize('parent'), async (req, res) => {
  try {
    const parent = await User.findById(req.user._id).populate('linkedStudents');
    res.json(parent.linkedStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
