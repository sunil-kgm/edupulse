const express = require('express');
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');
const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/unread-count', async (req, res) => {
  try {
    const count = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
