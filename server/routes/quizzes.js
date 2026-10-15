const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { Quiz, QuizAttempt } = require('../models/Quiz');
const router = express.Router();

router.use(protect);

router.get('/course/:courseId', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId, isActive: true }).populate('course', 'name');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/student/:studentId/attempts', async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ student: req.params.studentId })
      .populate({ path: 'quiz', populate: { path: 'course', select: 'name code' } });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('course', 'name code');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    // Hide correct answers for non-faculty
    if (req.user.role === 'student') {
      const sanitized = quiz.toObject();
      sanitized.questions = sanitized.questions.map(q => ({ ...q, correctAnswer: undefined }));
      return res.json(sanitized);
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/attempt', authorize('student'), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    
    const { answers } = req.body;
    let score = 0;
    answers.forEach(ans => {
      const q = quiz.questions[ans.questionIndex];
      if (q && q.correctAnswer === ans.selectedAnswer) score += q.marks;
    });
    const maxScore = quiz.questions.reduce((sum, q) => sum + q.marks, 0);
    const percentage = Math.round((score / maxScore) * 100);
    
    const attempt = await QuizAttempt.findOneAndUpdate(
      { quiz: req.params.id, student: req.user._id },
      { answers, score, percentage, status: 'completed', submittedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json({ ...attempt.toObject(), correctAnswers: quiz.questions.map(q => q.correctAnswer) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
