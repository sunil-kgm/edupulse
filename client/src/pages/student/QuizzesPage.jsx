import { useState } from 'react';
import { DEMO_QUIZZES, DEMO_COURSES } from '../../data/mockData';
import { FiPlus, FiX, FiCheck, FiClock, FiBarChart2, FiUsers, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';

// ── Student Quiz Taking Interface ──
function QuizInterface({ quiz, onClose, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const letters = ['A', 'B', 'C', 'D'];

  const handleSubmit = () => {
    let score = 0;
    quiz.questions.forEach((q, i) => { if (answers[i] === q.correctAnswer) score += q.marks; });
    const total = quiz.questions.reduce((s, q) => s + q.marks, 0);
    const pct = Math.round((score / total) * 100);
    setResult({ score, total, pct });
    setSubmitted(true);
    onComplete(quiz._id, pct);
  };

  const question = quiz.questions[currentQ];
  const answered = Object.keys(answers).length;

  if (submitted && result) {
    return (
      <div className="modal-overlay">
        <div className="modal-container animate-scale-in" style={{ maxWidth: '500px' }}>
          <div className="modal-header">
            <div className="modal-title">Quiz Results</div>
            <button className="modal-close" onClick={onClose}><FiX /></button>
          </div>
          <div className="modal-body" style={{ textAlign: 'center' }}>
            <div style={{ width: 110, height: 110, borderRadius: '50%', margin: '0 auto 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: result.pct >= 60 ? '#f0fdf4' : '#fef2f2', border: `4px solid ${result.pct >= 60 ? '#16a34a' : '#ef4444'}` }}>
              <div style={{ fontSize: '30px', fontWeight: 800, color: result.pct >= 60 ? '#16a34a' : '#ef4444' }}>{result.pct}%</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Score</div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{result.pct >= 80 ? '🎉 Excellent!' : result.pct >= 60 ? '👍 Good Job!' : '📚 Needs Improvement'}</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '20px' }}>You scored {result.score} out of {result.total} marks</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Correct', value: quiz.questions.filter((q, i) => answers[i] === q.correctAnswer).length, color: '#16a34a' },
                { label: 'Incorrect', value: quiz.questions.filter((q, i) => answers[i] !== undefined && answers[i] !== q.correctAnswer).length, color: '#ef4444' },
                { label: 'Skipped', value: quiz.questions.length - Object.keys(answers).length, color: '#f59e0b' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--color-bg-secondary)', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-lg animate-slide-up">
        <div className="modal-header">
          <div>
            <div className="modal-title">{quiz.title}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{quiz.course.name} · {quiz.duration} min · {quiz.questions.length} questions</div>
          </div>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Question {currentQ + 1} of {quiz.questions.length}</span>
              <span style={{ fontWeight: 600 }}>{answered} answered</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${((currentQ + 1) / quiz.questions.length) * 100}%` }} />
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
              {quiz.questions.map((_, i) => (
                <button key={i} onClick={() => setCurrentQ(i)} style={{
                  width: 32, height: 32, borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  background: i === currentQ ? 'var(--color-primary)' : answers[i] !== undefined ? 'var(--color-primary-lighter)' : 'var(--color-bg-secondary)',
                  color: i === currentQ ? 'white' : answers[i] !== undefined ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  border: `1.5px solid ${i === currentQ ? 'var(--color-primary)' : answers[i] !== undefined ? 'var(--color-primary)' : 'var(--color-border)'}`,
                }}>{i + 1}</button>
              ))}
            </div>
          </div>
          <div className="quiz-question-card">
            <div className="quiz-question-text">
              <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Q{currentQ + 1}. </span>{question.question}
            </div>
            <div className="quiz-options">
              {question.options.map((opt, i) => (
                <div key={i} className={`quiz-option${answers[currentQ] === i ? ' selected' : ''}`} onClick={() => setAnswers(prev => ({ ...prev, [currentQ]: i }))}>
                  <div className="quiz-option-letter">{letters[i]}</div>
                  <span style={{ fontSize: '14px' }}>{opt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button className="btn btn-secondary" onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}>
            <FiChevronLeft size={14} /> Previous
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentQ < quiz.questions.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setCurrentQ(q => q + 1)}>Next <FiChevronRight size={14} /></button>
            ) : (
              <button className="btn btn-primary" onClick={handleSubmit}><FiCheck size={14} /> Submit Quiz</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentQuizzesView() {
  const [quizzes, setQuizzes] = useState(DEMO_QUIZZES);
  const [activeQuiz, setActiveQuiz] = useState(null);

  const handleComplete = (quizId, percentage) => {
    setQuizzes(prev => prev.map(q => q._id === quizId
      ? { ...q, attempt: { score: Math.round(percentage * q.maxScore / 100), percentage, status: 'completed', submittedAt: new Date().toISOString().split('T')[0] } }
      : q
    ));
  };

  const available = quizzes.filter(q => !q.attempt || q.attempt.status === 'pending');
  const completed = quizzes.filter(q => q.attempt && q.attempt.status === 'completed');

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Quizzes</div>
          <div className="page-subtitle">{available.length} available · {completed.length} completed</div>
        </div>
      </div>

      {available.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>📋 Available Quizzes</h3>
          <div className="grid-2">
            {available.map(q => (
              <div key={q._id} className="card" style={{ transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>{q.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{q.course.name}</div>
                  </div>
                  <span className="badge badge-info">Available</span>
                </div>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
                  <div><div style={{ fontSize: '18px', fontWeight: 700 }}>{q.questions.length}</div><div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Questions</div></div>
                  <div><div style={{ fontSize: '18px', fontWeight: 700 }}>{q.duration}</div><div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Minutes</div></div>
                  <div><div style={{ fontSize: '18px', fontWeight: 700 }}>{q.maxScore}</div><div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Max Marks</div></div>
                </div>
                {q.dueDate && <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>⏰ Due: {q.dueDate}</div>}
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setActiveQuiz(q)}>Attempt Quiz →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>✅ Completed Quizzes</h3>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="data-table">
                <thead><tr><th>Quiz</th><th>Course</th><th>Score</th><th>Percentage</th><th>Submitted</th><th>Result</th></tr></thead>
                <tbody>
                  {completed.map(q => (
                    <tr key={q._id}>
                      <td style={{ fontWeight: 600 }}>{q.title}</td>
                      <td>{q.course.name}</td>
                      <td style={{ fontWeight: 700 }}>{q.attempt.score}/{q.maxScore}</td>
                      <td>
                        <div style={{ fontWeight: 700, color: q.attempt.percentage >= 60 ? 'var(--color-success)' : 'var(--color-error)' }}>{q.attempt.percentage}%</div>
                        <div className="progress-bar-container" style={{ height: '4px', marginTop: '4px', width: '80px' }}>
                          <div className="progress-bar-fill" style={{ width: `${q.attempt.percentage}%`, background: q.attempt.percentage >= 60 ? 'var(--color-primary)' : '#ef4444' }} />
                        </div>
                      </td>
                      <td style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>{q.attempt.submittedAt}</td>
                      <td><span className={`badge ${q.attempt.percentage >= 60 ? 'badge-success' : 'badge-error'}`}>{q.attempt.percentage >= 60 ? 'Pass' : 'Fail'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeQuiz && <QuizInterface quiz={activeQuiz} onClose={() => setActiveQuiz(null)} onComplete={handleComplete} />}
    </div>
  );
}


// Mock class-level quiz results
const CLASS_RESULTS = {
  quiz_001: [
    { name: 'Arun Kumar', rollNo: 'CSE2024001', score: 40, percentage: 40, status: 'completed' },
    { name: 'Preethi Raj', rollNo: 'CSE2024002', score: 35, percentage: 35, status: 'completed' },
    { name: 'Meera Sundar', rollNo: 'CSE2024003', score: 45, percentage: 45, status: 'completed' },
    { name: 'Kiran Babu', rollNo: 'CSE2024004', score: 50, percentage: 50, status: 'completed' },
    { name: 'Divya R', rollNo: 'CSE2024005', score: 20, percentage: 20, status: 'completed' },
  ],
  quiz_002: [
    { name: 'Arun Kumar', rollNo: 'CSE2024001', score: null, percentage: null, status: 'pending' },
    { name: 'Preethi Raj', rollNo: 'CSE2024002', score: 40, percentage: 80, status: 'completed' },
    { name: 'Meera Sundar', rollNo: 'CSE2024003', score: 38, percentage: 76, status: 'completed' },
    { name: 'Kiran Babu', rollNo: 'CSE2024004', score: null, percentage: null, status: 'pending' },
  ],
};

function CreateQuizModal({ onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: '', courseId: '', duration: 30, dueDate: '' });
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: 0, marks: 10 },
  ]);
  const [saving, setSaving] = useState(false);

  const addQuestion = () => setQuestions(q => [...q, { question: '', options: ['', '', '', ''], correctAnswer: 0, marks: 10 }]);
  const removeQuestion = (i) => setQuestions(q => q.filter((_, idx) => idx !== i));
  const updateQuestion = (i, field, val) => setQuestions(q => q.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  const updateOption = (qi, oi, val) => setQuestions(q => q.map((item, idx) => idx === qi ? { ...item, options: item.options.map((o, j) => j === oi ? val : o) } : item));

  const handleCreate = () => {
    setSaving(true);
    setTimeout(() => {
      onCreate({ ...form, questions });
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-lg animate-slide-up">
        <div className="modal-header">
          <div>
            <div className="modal-title">Create New Quiz</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>Step {step} of 2</div>
          </div>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>

        <div style={{ padding: '8px 24px', background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '8px' }}>
          {['Quiz Details', 'Add Questions'].map((label, i) => (
            <div key={i} style={{
              fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '99px',
              background: step === i + 1 ? 'var(--color-primary)' : 'transparent',
              color: step === i + 1 ? 'white' : 'var(--color-text-muted)',
            }}>{i + 1}. {label}</div>
          ))}
        </div>

        <div className="modal-body">
          {step === 1 ? (
            <>
              <div className="form-group">
                <label className="form-label">Quiz Title *</label>
                <input className="form-input" placeholder="e.g. Mid-Semester Test: Sorting Algorithms" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Course *</label>
                <select className="form-input" value={form.courseId} onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))}>
                  <option value="">Select course...</option>
                  {DEMO_COURSES.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input className="form-input" type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input className="form-input" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {questions.map((q, qi) => (
                <div key={qi} style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-primary)' }}>Question {qi + 1}</div>
                    {questions.length > 1 && (
                      <button onClick={() => removeQuestion(qi)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FiTrash2 size={14} /></button>
                    )}
                  </div>
                  <div className="form-group">
                    <input className="form-input" placeholder="Enter the question..." value={q.question} onChange={e => updateQuestion(qi, 'question', e.target.value)} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === oi} onChange={() => updateQuestion(qi, 'correctAnswer', oi)} style={{ accentColor: 'var(--color-primary)' }} />
                        <input className="form-input" style={{ flex: 1 }} placeholder={`Option ${String.fromCharCode(65 + oi)}`} value={opt} onChange={e => updateOption(qi, oi, e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    <span>Marks:</span>
                    <input className="form-input" type="number" value={q.marks} onChange={e => updateQuestion(qi, 'marks', Number(e.target.value))} style={{ width: '70px', padding: '4px 8px' }} />
                    <span style={{ color: '#16a34a', fontSize: '11px', fontWeight: 600 }}>â˜… Select correct answer via radio button</span>
                  </div>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={addQuestion}>
                <FiPlus size={14} /> Add Question
              </button>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step === 2 && <button className="btn btn-secondary" onClick={() => setStep(1)}>â† Back</button>}
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          {step === 1 ? (
            <button className="btn btn-primary" disabled={!form.title || !form.courseId} onClick={() => setStep(2)}>
              Next: Add Questions â†’
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleCreate} disabled={saving || questions.some(q => !q.question)}>
              {saving ? 'Publishing...' : <><FiCheck size={14} /> Publish Quiz</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuizzesPage() {
  const { user } = useAuth();

  // ── All hooks declared BEFORE any conditional returns (React rules of hooks) ──
  const [quizzes, setQuizzes] = useState(DEMO_QUIZZES);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // ── Students see the attempt view; faculty see the manage/results view ──
  if (user?.role === 'student') return <StudentQuizzesView />;


  const handleCreate = (data) => {
    const course = DEMO_COURSES.find(c => c._id === data.courseId);
    setQuizzes(prev => [{
      _id: `quiz_${Date.now()}`,
      title: data.title,
      course: { _id: data.courseId, name: course?.name || '', code: course?.code || '' },
      faculty: { name: 'Dr. Priya Nair' },
      questions: data.questions,
      duration: Number(data.duration),
      maxScore: data.questions.reduce((s, q) => s + q.marks, 0),
      dueDate: data.dueDate,
      attempt: null,
    }, ...prev]);
  };

  const getResults = (quizId) => CLASS_RESULTS[quizId] || [];

  const getChartData = (quizId) => {
    const results = getResults(quizId).filter(r => r.status === 'completed');
    return [
      { range: '0-40%', count: results.filter(r => r.percentage < 40).length },
      { range: '40-60%', count: results.filter(r => r.percentage >= 40 && r.percentage < 60).length },
      { range: '60-80%', count: results.filter(r => r.percentage >= 60 && r.percentage < 80).length },
      { range: '80-100%', count: results.filter(r => r.percentage >= 80).length },
    ];
  };

  const totalAttempted = Object.values(CLASS_RESULTS).flat().filter(r => r.status === 'completed').length;
  const totalPending = Object.values(CLASS_RESULTS).flat().filter(r => r.status === 'pending').length;

  const tabs = [
    { key: 'overview', label: 'ðŸ“‹ All Quizzes' },
    { key: 'results', label: 'ðŸ“Š Results & Analytics' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Quizzes</div>
          <div className="page-subtitle">{quizzes.length} quizzes Â· {totalAttempted} attempts Â· {totalPending} pending</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <FiPlus size={14} /> Create Quiz
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { icon: <FiBarChart2 size={20} color="#3b82f6" />, label: 'Total Quizzes', value: quizzes.length, bg: '#eff6ff' },
          { icon: <FiUsers size={20} color="#16a34a" />, label: 'Attempted', value: totalAttempted, bg: '#f0fdf4' },
          { icon: <FiClock size={20} color="#f97316" />, label: 'Pending Attempts', value: totalPending, bg: '#fff7ed' },
          { icon: <FiCheck size={20} color="#7c3aed" />, label: 'Pass Rate', value: `${Math.round((Object.values(CLASS_RESULTS).flat().filter(r => (r.percentage || 0) >= 60).length / (totalAttempted || 1)) * 100)}%`, bg: '#f3e8ff' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>{s.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: '8px 18px', borderRadius: '99px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            background: activeTab === t.key ? 'var(--color-primary)' : 'white',
            color: activeTab === t.key ? 'white' : 'var(--color-text-secondary)',
            border: `1.5px solid ${activeTab === t.key ? 'var(--color-primary)' : 'var(--color-border)'}`,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Quiz</th>
                  <th>Course</th>
                  <th>Questions</th>
                  <th>Duration</th>
                  <th>Due Date</th>
                  <th>Attempts</th>
                  <th>Avg Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map(q => {
                  const results = getResults(q._id).filter(r => r.status === 'completed');
                  const avg = results.length ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length) : null;
                  const attempted = getResults(q._id).filter(r => r.status === 'completed').length;
                  const total = getResults(q._id).length;
                  return (
                    <tr key={q._id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{q.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>Max: {q.maxScore} marks</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '13px', fontWeight: 500 }}>{q.course.name}</div>
                        <span className="badge badge-info" style={{ fontSize: '10px' }}>{q.course.code}</span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{q.questions.length}</td>
                      <td style={{ fontSize: '13px' }}>{q.duration} min</td>
                      <td style={{ fontSize: '13px', color: q.dueDate && new Date(q.dueDate) < new Date() ? 'var(--color-error)' : 'var(--color-text-primary)' }}>{q.dueDate || 'â€”'}</td>
                      <td>
                        {total > 0 ? (
                          <>
                            <div style={{ fontWeight: 700 }}>{attempted}/{total}</div>
                            <div className="progress-bar-container" style={{ width: '60px', marginTop: '4px' }}>
                              <div className="progress-bar-fill" style={{ width: `${(attempted / total) * 100}%` }} />
                            </div>
                          </>
                        ) : <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>No data</span>}
                      </td>
                      <td>
                        {avg !== null ? (
                          <span style={{ fontWeight: 700, color: avg >= 60 ? '#16a34a' : '#ef4444' }}>{avg}%</span>
                        ) : <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>â€”</span>}
                      </td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedQuiz(q); setActiveTab('results'); }}>
                          <FiBarChart2 size={12} /> Results
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results & Analytics Tab */}
      {activeTab === 'results' && (
        <div>
          {/* Quiz Selector */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {quizzes.map(q => (
              <button key={q._id} onClick={() => setSelectedQuiz(q)} style={{
                padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                background: selectedQuiz?._id === q._id ? 'var(--color-primary)' : 'white',
                color: selectedQuiz?._id === q._id ? 'white' : 'var(--color-text-secondary)',
                border: `1.5px solid ${selectedQuiz?._id === q._id ? 'var(--color-primary)' : 'var(--color-border)'}`,
              }}>{q.title}</button>
            ))}
          </div>

          {selectedQuiz ? (
            <>
              <div className="grid-2" style={{ marginBottom: '24px' }}>
                {/* Score Distribution Chart */}
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Score Distribution</div>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={getChartData(selectedQuiz._id)} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '13px' }} />
                      <Bar dataKey="count" fill="var(--color-primary)" name="Students" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Summary Stats */}
                <div className="card">
                  <div className="card-title" style={{ marginBottom: '16px' }}>Quiz Summary â€” {selectedQuiz.title}</div>
                  {(() => {
                    const results = getResults(selectedQuiz._id).filter(r => r.status === 'completed');
                    const avg = results.length ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length) : 0;
                    const highest = results.length ? Math.max(...results.map(r => r.percentage)) : 0;
                    const lowest = results.length ? Math.min(...results.map(r => r.percentage)) : 0;
                    const passCount = results.filter(r => r.percentage >= 60).length;
                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {[
                          { label: 'Class Average', value: `${avg}%`, color: avg >= 60 ? '#16a34a' : '#ef4444' },
                          { label: 'Pass Rate', value: `${results.length ? Math.round((passCount / results.length) * 100) : 0}%`, color: '#3b82f6' },
                          { label: 'Highest Score', value: `${highest}%`, color: '#16a34a' },
                          { label: 'Lowest Score', value: `${lowest}%`, color: '#ef4444' },
                        ].map(s => (
                          <div key={s.label} style={{ background: 'var(--color-bg-secondary)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Student Results Table */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
                  <div className="card-title">Student Results</div>
                </div>
                <div className="table-container" style={{ border: 'none' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Roll Number</th>
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Status</th>
                        <th>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getResults(selectedQuiz._id).map((r, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{r.name}</td>
                          <td style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{r.rollNo}</td>
                          <td style={{ fontWeight: 700 }}>
                            {r.score !== null ? `${r.score}/${selectedQuiz.maxScore}` : 'â€”'}
                          </td>
                          <td>
                            {r.percentage !== null ? (
                              <div>
                                <div style={{ fontWeight: 700, color: r.percentage >= 60 ? '#16a34a' : '#ef4444' }}>{r.percentage}%</div>
                                <div className="progress-bar-container" style={{ width: '80px', marginTop: '4px' }}>
                                  <div className="progress-bar-fill" style={{ width: `${r.percentage}%`, background: r.percentage >= 60 ? 'var(--color-primary)' : '#ef4444' }} />
                                </div>
                              </div>
                            ) : <span style={{ color: 'var(--color-text-muted)' }}>â€”</span>}
                          </td>
                          <td>
                            <span className={`badge ${r.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                              {r.status === 'completed' ? 'Submitted' : 'Not Attempted'}
                            </span>
                          </td>
                          <td>
                            {r.percentage !== null
                              ? <span className={`badge ${r.percentage >= 60 ? 'badge-success' : 'badge-error'}`}>{r.percentage >= 60 ? 'Pass' : 'Fail'}</span>
                              : <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>â€”</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>ðŸ“Š</div>
              <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>Select a quiz above</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Choose a quiz to view detailed results and analytics.</div>
            </div>
          )}
        </div>
      )}

      {showCreate && (
        <CreateQuizModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}
