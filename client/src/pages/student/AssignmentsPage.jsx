import { useState } from 'react';
import { DEMO_ASSIGNMENTS, DEMO_COURSES } from '../../data/mockData';
import { FiPlus, FiX, FiCheck, FiClock, FiAlertTriangle, FiFileText, FiUsers, FiEdit2, FiUpload } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';


// Mock student submissions for faculty view
const STUDENT_SUBMISSIONS = [
  {
    _id: 'sub_001', assignmentId: 'assign_001',
    student: { name: 'Arun Kumar', rollNumber: 'CSE2024001', class: 'III CSE-A' },
    submittedAt: '2026-09-21', status: 'submitted', score: null,
    content: 'Implemented BST with insertion, deletion and inorder traversal. Time complexity O(log n) average.',
  },
  {
    _id: 'sub_002', assignmentId: 'assign_001',
    student: { name: 'Preethi Raj', rollNumber: 'CSE2024002', class: 'III CSE-A' },
    submittedAt: '2026-09-22', status: 'submitted', score: 85,
    content: 'Complete implementation with all three traversals and edge case handling.',
  },
  {
    _id: 'sub_003', assignmentId: 'assign_004',
    student: { name: 'Arun Kumar', rollNumber: 'CSE2024001', class: 'III CSE-A' },
    submittedAt: '2026-09-20', status: 'graded', score: 72,
    content: 'Star and mesh topology diagrams with device count and cable specifications.',
  },
  {
    _id: 'sub_004', assignmentId: 'assign_004',
    student: { name: 'Meera Sundar', rollNumber: 'CSE2024003', class: 'III CSE-A' },
    submittedAt: '2026-09-19', status: 'graded', score: 91,
    content: 'Detailed network design with IP allocation and routing tables.',
  },
];

const STATUS_CONFIG = {
  submitted: { badge: 'badge-info', label: 'Needs Grading', icon: <FiClock size={11} /> },
  graded: { badge: 'badge-success', label: 'Graded', icon: <FiCheck size={11} /> },
  overdue: { badge: 'badge-error', label: 'Overdue', icon: <FiAlertTriangle size={11} /> },
  pending: { badge: 'badge-warning', label: 'Not Submitted', icon: <FiClock size={11} /> },
  incomplete: { badge: 'badge-warning', label: 'Incomplete', icon: <FiAlertTriangle size={11} /> },
};

function GradeModal({ submission, onClose, onGrade }) {
  const [score, setScore] = useState(submission.score || '');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const handleGrade = () => {
    if (!score) return;
    setSaving(true);
    setTimeout(() => {
      onGrade(submission._id, Number(score));
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-sm animate-slide-up">
        <div className="modal-header">
          <div className="modal-title">Grade Submission</div>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--color-bg-secondary)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>{submission.student.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{submission.student.rollNumber} · Submitted {submission.submittedAt}</div>
          </div>
          <div style={{ marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '10px', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            <div style={{ fontWeight: 600, marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Student's Work</div>
            {submission.content}
          </div>
          <div className="form-group">
            <label className="form-label">Score (out of 100)</label>
            <input
              className="form-input"
              type="number" min="0" max="100"
              placeholder="Enter score..."
              value={score}
              onChange={e => setScore(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Feedback (optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Write feedback for the student..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleGrade} disabled={!score || saving}>
            {saving ? 'Saving...' : <><FiCheck size={14} /> Submit Grade</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateAssignmentModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ title: '', courseId: '', description: '', dueDate: '', maxScore: 100 });
  const [saving, setSaving] = useState(false);

  const handleCreate = () => {
    if (!form.title || !form.courseId) return;
    setSaving(true);
    setTimeout(() => {
      onCreate(form);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container animate-slide-up">
        <div className="modal-header">
          <div className="modal-title">Create New Assignment</div>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Assignment Title *</label>
            <input className="form-input" placeholder="e.g. Lab Exercise 4: Graph Traversal" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Course *</label>
            <select className="form-input" value={form.courseId} onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))}>
              <option value="">Select course...</option>
              {DEMO_COURSES.map(c => (
                <option key={c._id} value={c._id}>{c.name} ({c.code})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description / Instructions</label>
            <textarea className="form-textarea" rows={4} placeholder="Describe what students need to do..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input className="form-input" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Max Score</label>
              <input className="form-input" type="number" value={form.maxScore} onChange={e => setForm(f => ({ ...f, maxScore: e.target.value }))} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate} disabled={!form.title || !form.courseId || saving}>
            {saving ? 'Creating...' : <><FiPlus size={14} /> Create Assignment</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Student submit modal ──
function SubmitModal({ assignment, onClose, onSubmit }) {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const handle = () => {
    setSubmitted(true);
    setTimeout(() => { onSubmit(assignment._id); onClose(); }, 1500);
  };
  return (
    <div className="modal-overlay">
      <div className="modal-container modal-sm animate-slide-up">
        <div className="modal-header">
          <div className="modal-title">Submit Assignment</div>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        {submitted ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: '18px' }}>Submitted!</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '6px' }}>Your work has been recorded.</div>
          </div>
        ) : (
          <>
            <div className="modal-body">
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{assignment.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{assignment.course.name} · Due {assignment.dueDate}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Your Submission</label>
                <textarea className="form-textarea" placeholder="Write your answer or paste your work here..." value={text} onChange={e => setText(e.target.value)} rows={5} />
              </div>
              <div style={{ background: 'var(--color-bg-secondary)', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                📎 File upload available when connected to backend.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handle} disabled={!text.trim()}>
                <FiUpload size={14} /> Submit Assignment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const STUDENT_STATUS = {
  submitted: { badge: 'badge-success', label: 'Submitted', icon: <FiCheck size={12} /> },
  pending:   { badge: 'badge-info',    label: 'Pending',   icon: <FiClock size={12} /> },
  incomplete:{ badge: 'badge-warning', label: 'Incomplete',icon: <FiAlertTriangle size={12} /> },
  overdue:   { badge: 'badge-error',   label: 'Overdue',   icon: <FiAlertTriangle size={12} /> },
};

function StudentAssignmentsView() {
  const [assignments, setAssignments] = useState(DEMO_ASSIGNMENTS);
  const [filter, setFilter] = useState('all');
  const [submitting, setSubmitting] = useState(null);

  const filtered = filter === 'all' ? assignments : assignments.filter(a => a.status === filter);
  const handleSubmit = (id) => {
    setAssignments(prev => prev.map(a => a._id === id
      ? { ...a, status: 'submitted', submittedAt: new Date().toISOString().split('T')[0] }
      : a
    ));
  };

  const filters = ['all', 'pending', 'incomplete', 'overdue', 'submitted'];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Assignments</div>
          <div className="page-subtitle">
            {assignments.filter(a => a.status !== 'submitted').length} pending · {assignments.filter(a => a.status === 'submitted').length} submitted
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 16px', borderRadius: '99px', fontSize: '13px', fontWeight: 600,
            background: filter === f ? 'var(--color-primary)' : 'white',
            color: filter === f ? 'white' : 'var(--color-text-secondary)',
            border: `1.5px solid ${filter === f ? 'var(--color-primary)' : 'var(--color-border)'}`,
            cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
          }}>{f}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Course</th>
                <th>Faculty</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const sc = STUDENT_STATUS[a.status] || STUDENT_STATUS.pending;
                const isOverdue = new Date(a.dueDate) < new Date() && a.status !== 'submitted';
                return (
                  <tr key={a._id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{a.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{a.description?.slice(0, 55)}...</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>{a.course.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{a.course.code}</div>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{a.faculty?.name || '—'}</td>
                    <td>
                      <div style={{ fontSize: '13px', color: isOverdue ? 'var(--color-error)' : 'var(--color-text-primary)', fontWeight: isOverdue ? 600 : 400 }}>{a.dueDate}</div>
                      {isOverdue && <div style={{ fontSize: '11px', color: 'var(--color-error)' }}>Overdue</div>}
                    </td>
                    <td><span className={`badge ${sc.badge}`}>{sc.icon} {sc.label}</span></td>
                    <td>
                      {a.score != null
                        ? <div style={{ fontWeight: 700, color: a.score >= 60 ? '#16a34a' : '#ef4444' }}>{a.score}/100</div>
                        : <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>—</span>
                      }
                    </td>
                    <td>
                      {a.status === 'submitted'
                        ? <span style={{ fontSize: '13px', color: 'var(--color-success)', fontWeight: 600 }}>✓ Done</span>
                        : <button className="btn btn-primary btn-sm" onClick={() => setSubmitting(a)}>
                            <FiUpload size={12} /> Submit
                          </button>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {submitting && (
        <SubmitModal assignment={submitting} onClose={() => setSubmitting(null)} onSubmit={handleSubmit} />
      )}
    </div>
  );
}

export default function AssignmentsPage() {
  const { user } = useAuth();

  // ── All hooks declared BEFORE any conditional returns (React rules of hooks) ──
  const [assignments, setAssignments] = useState(DEMO_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState(STUDENT_SUBMISSIONS);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // ── Students see the submit view; faculty see the manage/grade view ──
  if (user?.role === 'student') return <StudentAssignmentsView />;


  const handleGrade = (subId, score) => {
    setSubmissions(prev => prev.map(s => s._id === subId ? { ...s, score, status: 'graded' } : s));
  };

  const handleCreate = (form) => {
    const course = DEMO_COURSES.find(c => c._id === form.courseId);
    const newAssignment = {
      _id: `assign_${Date.now()}`,
      title: form.title,
      course: { _id: form.courseId, name: course?.name || '', code: course?.code || '' },
      faculty: { name: 'Dr. Priya Nair' },
      description: form.description,
      dueDate: form.dueDate,
      maxScore: Number(form.maxScore),
      status: 'pending',
      score: null,
    };
    setAssignments(prev => [newAssignment, ...prev]);
  };

  const getSubmissionsFor = (assignmentId) => submissions.filter(s => s.assignmentId === assignmentId);
  const needsGrading = submissions.filter(s => s.status === 'submitted').length;

  const tabs = [
    { key: 'overview', label: '📋 All Assignments' },
    { key: 'grading', label: `✏️ Grading Queue ${needsGrading > 0 ? `(${needsGrading})` : ''}` },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Assignments</div>
          <div className="page-subtitle">
            {assignments.length} assignments · {needsGrading} submission{needsGrading !== 1 ? 's' : ''} need grading
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <FiPlus size={14} /> Create Assignment
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { icon: <FiFileText size={20} color="#3b82f6" />, label: 'Total Assignments', value: assignments.length, bg: '#eff6ff' },
          { icon: <FiClock size={20} color="#f97316" />, label: 'Needs Grading', value: needsGrading, bg: '#fff7ed' },
          { icon: <FiCheck size={20} color="#16a34a" />, label: 'Graded', value: submissions.filter(s => s.status === 'graded').length, bg: '#f0fdf4' },
          { icon: <FiUsers size={20} color="#7c3aed" />, label: 'Total Submissions', value: submissions.length, bg: '#f3e8ff' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              {s.icon}
            </div>
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
                  <th>Assignment</th>
                  <th>Course</th>
                  <th>Due Date</th>
                  <th>Submissions</th>
                  <th>Graded</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => {
                  const subs = getSubmissionsFor(a._id);
                  const graded = subs.filter(s => s.status === 'graded').length;
                  const pending = subs.filter(s => s.status === 'submitted').length;
                  const isOverdue = new Date(a.dueDate) < new Date();
                  return (
                    <tr key={a._id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{a.title}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{a.description.slice(0, 55)}...</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: '13px' }}>{a.course.name}</div>
                        <span className="badge badge-info" style={{ fontSize: '10px', marginTop: '4px' }}>{a.course.code}</span>
                      </td>
                      <td>
                        <div style={{ fontSize: '13px', color: isOverdue ? 'var(--color-error)' : 'var(--color-text-primary)', fontWeight: isOverdue ? 600 : 400 }}>{a.dueDate}</div>
                        {isOverdue && <div style={{ fontSize: '11px', color: 'var(--color-error)' }}>Past due</div>}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{subs.length}</div>
                        {pending > 0 && <div style={{ fontSize: '11px', color: '#f97316', fontWeight: 600 }}>{pending} need grading</div>}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: graded > 0 ? '#16a34a' : 'var(--color-text-muted)' }}>{graded}/{subs.length}</div>
                        {subs.length > 0 && (
                          <div className="progress-bar-container" style={{ width: '60px', marginTop: '4px' }}>
                            <div className="progress-bar-fill" style={{ width: `${subs.length ? (graded / subs.length) * 100 : 0}%` }} />
                          </div>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedAssignment(a); setActiveTab('grading'); }}>
                          <FiEdit2 size={12} /> Review
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

      {/* Grading Queue Tab */}
      {activeTab === 'grading' && (
        <div>
          {selectedAssignment && (
            <div style={{ marginBottom: '16px', padding: '14px 18px', background: 'var(--color-primary-lighter)', border: '1px solid var(--color-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiFileText size={18} color="var(--color-primary)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-primary)' }}>{selectedAssignment.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{selectedAssignment.course.name} · Due {selectedAssignment.dueDate}</div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedAssignment(null)}>View All</button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(selectedAssignment
              ? getSubmissionsFor(selectedAssignment._id)
              : submissions.filter(s => s.status === 'submitted')
            ).length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>✅</div>
                <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>All caught up!</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>No submissions waiting for grading.</div>
              </div>
            ) : (
              (selectedAssignment
                ? getSubmissionsFor(selectedAssignment._id)
                : submissions.filter(s => s.status === 'submitted')
              ).map(sub => (
                <div key={sub._id} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div className="avatar avatar-sm" style={{ background: '#eff6ff', color: '#3b82f6', fontWeight: 700, flexShrink: 0 }}>
                    {sub.student.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{sub.student.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{sub.student.rollNumber} · {sub.student.class} · Submitted {sub.submittedAt}</div>
                      </div>
                      {sub.score !== null
                        ? <span className="badge badge-success">✓ Graded: {sub.score}/100</span>
                        : <span className="badge badge-warning">Awaiting Grade</span>
                      }
                    </div>
                    <div style={{ background: 'var(--color-bg-secondary)', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
                      {sub.content}
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flexShrink: 0 }}
                    onClick={() => setGradingSubmission(sub)}
                  >
                    <FiEdit2 size={12} /> Grade
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {gradingSubmission && (
        <GradeModal
          submission={gradingSubmission}
          onClose={() => setGradingSubmission(null)}
          onGrade={handleGrade}
        />
      )}
      {showCreate && (
        <CreateAssignmentModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
