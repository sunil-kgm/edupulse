const express = require('express');
const { protect } = require('../middleware/auth');
const LearningResource = require('../models/LearningResource');
const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { course, type } = req.query;
    const filter = { isActive: true };
    if (course) filter.course = course;
    if (type) filter.type = type;
    const resources = await LearningResource.find(filter).populate('course', 'name code');
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
