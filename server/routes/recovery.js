const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const RecoveryPath = require('../models/RecoveryPath');
const router = express.Router();

router.use(protect);

router.get('/student/:studentId', async (req, res) => {
  try {
    const path = await RecoveryPath.findOne({ student: req.params.studentId, status: 'active' })
      .populate('riskFlag').populate('student', 'name email');
    res.json(path);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/student/:studentId', authorize('faculty', 'admin', 'hod'), async (req, res) => {
  try {
    const { riskFlagId } = req.body;
    const defaultMilestones = [
      { title: 'Risk Identified', description: 'Low performance detected by EduPulse', status: 'completed', order: 1 },
      { title: 'Review Learning Material', description: 'Study recommended resources', status: 'current', order: 2 },
      { title: 'Complete Practice Quiz', description: 'Attempt practice quiz for weak areas', status: 'pending', order: 3 },
      { title: 'Submit Pending Assignment', description: 'Complete and submit all pending assignments', status: 'pending', order: 4 },
      { title: 'Faculty Review', description: 'Faculty reviews improved performance', status: 'pending', order: 5 },
      { title: 'Recovery Complete', description: 'Risk resolved, back on track', status: 'pending', order: 6 },
    ];
    
    await RecoveryPath.updateMany({ student: req.params.studentId, status: 'active' }, { status: 'abandoned' });
    
    const path = await RecoveryPath.create({
      student: req.params.studentId,
      riskFlag: riskFlagId,
      milestones: defaultMilestones,
      progressPercent: 17,
    });
    res.status(201).json(path);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update milestone status
router.patch('/:pathId/milestone/:milestoneId', async (req, res) => {
  try {
    const { status } = req.body;
    const recoveryPath = await RecoveryPath.findById(req.params.pathId);
    if (!recoveryPath) return res.status(404).json({ message: 'Recovery path not found' });
    
    const milestone = recoveryPath.milestones.id(req.params.milestoneId);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });
    
    milestone.status = status;
    if (status === 'completed') milestone.completedAt = new Date();
    
    const completed = recoveryPath.milestones.filter(m => m.status === 'completed').length;
    recoveryPath.progressPercent = Math.round((completed / recoveryPath.milestones.length) * 100);
    
    if (recoveryPath.progressPercent === 100) {
      recoveryPath.status = 'completed';
      recoveryPath.completedAt = new Date();
    }
    
    await recoveryPath.save();
    res.json(recoveryPath);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
