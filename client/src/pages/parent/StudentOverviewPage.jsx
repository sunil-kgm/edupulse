import { DEMO_USERS, DEMO_RISK_FLAG, DEMO_ATTENDANCE, DEMO_COURSES, DEMO_ASSIGNMENTS, DEMO_QUIZZES, DEMO_RECOVERY_PATH } from '../../data/mockData';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiBook, FiFileText, FiCheckSquare, FiAlertTriangle } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PERF_DATA = [
  { month: 'Jul', performance: 75, attendance: 82 },
  { month: 'Aug', performance: 68, attendance: 75 },
  { month: 'Sep', performance: 44, attendance: 68 },
];

export default function StudentOverviewPage() {
  const student = DEMO_USERS.student;
  const att = DEMO_ATTENDANCE;
  const courses = DEMO_COURSES;
  const assignments = DEMO_ASSIGNMENTS;
  const quizzes = DEMO_QUIZZES;
  const recovery = DEMO_RECOVERY_PATH;

  const completedAssignments = assignments.filter(a => a.submitted).length;
  const quizAvg = Math.round(quizzes.reduce((s, q) => s + (q.score || 0), 0) / quizzes.filter(q => q.score != null).length);

  return (
    <div className="animate-fade-in">
      {/* Ward Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 60%, #f8f9fb 100%)',
        border: '1px solid #bfdbfe', borderRadius: '20px', padding: '28px', marginBottom: '28px',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#3b82f6', marginBottom: '12px' }}>YOUR WARD'S ACADEMIC OVERVIEW</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div className="avatar avatar-xl" style={{ background: '#3b82f615', color: '#3b82f6', fontWeight: 700 }}>{student.name[0]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>{student.name}</div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
              {student.class} · {student.department.name} · Roll No: {student.rollNumber}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-high-risk">⚠️ High Risk</span>
              <span className="badge badge-neutral">Semester 5</span>
              <span className="badge badge-info">Year 3</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', textAlign: 'center' }}>
            {[
              { label: 'Overall', value: `${quizAvg}%`, color: '#ef4444' },
              { label: 'Attendance', value: `${att.overall}%`, color: att.overall < 75 ? '#ef4444' : '#16a34a' },
              { label: 'Recovery', value: `${Math.round((recovery.filter(m => m.status === 'completed').length / recovery.length) * 100)}%`, color: '#7c3aed' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Courses Enrolled', value: courses.length, color: '#3b82f6', icon: '📚' },
          { label: 'Assignments', value: `${completedAssignments}/${assignments.length}`, color: '#16a34a', icon: '📝' },
          { label: 'Quiz Average', value: `${quizAvg}%`, color: quizAvg < 60 ? '#ef4444' : '#f97316', icon: '✏️' },
          { label: 'Attendance', value: `${att.overall}%`, color: att.overall < 75 ? '#ef4444' : '#16a34a', icon: '📅' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Performance Trend */}
        <div className="card">
          <div className="card-header"><div className="card-title">Performance Trend</div></div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={PERF_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[40, 100]} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '13px' }} />
              <Legend />
              <Line type="monotone" dataKey="performance" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 5 }} name="Performance %" />
              <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 5 }} name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Links */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>View Detailed Reports</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Academic Backlog', path: '/academic-backlog', icon: '📋', color: '#ef4444' },
              { label: 'Faculty Reports', path: '/faculty-reports', icon: '📝', color: '#f97316', badge: true },
              { label: 'Attendance Details', path: '/attendance', icon: '📅', color: '#3b82f6' },
              { label: 'Recovery Progress', path: '/recovery-progress', icon: '🛤️', color: '#7c3aed' },
              { label: 'Acknowledgements', path: '/acknowledgement-history', icon: '✅', color: '#16a34a' },
            ].map(a => (
              <Link key={a.label} to={a.path} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
                borderRadius: '10px', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)',
                textDecoration: 'none', color: 'var(--color-text-primary)', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = a.color + '10'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--color-bg-secondary)'; }}
              >
                <span style={{ fontSize: '18px' }}>{a.icon}</span>
                <span style={{ flex: 1 }}>{a.label}</span>
                <FiArrowRight size={14} style={{ color: 'var(--color-text-muted)' }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Summary */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <div className="card-title">Course-wise Performance</div>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead><tr><th>Course</th><th>Code</th><th>Faculty</th><th>Quiz Score</th><th>Progress</th><th>Status</th></tr></thead>
            <tbody>
              {courses.map(c => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td><span className="badge badge-info">{c.code}</span></td>
                  <td style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{c.faculty.name}</td>
                  <td style={{ fontWeight: 700, color: c.quizScore < 50 ? '#ef4444' : '#16a34a' }}>{c.quizScore}%</td>
                  <td style={{ width: '140px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar-container" style={{ flex: 1 }}>
                        <div className="progress-bar-fill" style={{ width: `${c.progress}%`, background: c.progress < 50 ? '#f97316' : 'var(--color-primary)' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700 }}>{c.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${c.quizScore >= 60 ? 'badge-success' : c.quizScore >= 40 ? 'badge-warning' : 'badge-error'}`}>
                      {c.quizScore >= 60 ? 'Good' : c.quizScore >= 40 ? 'At Risk' : 'Critical'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recovery Milestones */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Recovery Plan Status</div>
          <Link to="/recovery-progress" className="btn btn-secondary btn-sm">View Full Plan</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recovery.slice(0, 4).map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: m.status === 'completed' ? '#f0fdf4' : 'var(--color-bg-secondary)', borderRadius: '10px', border: `1px solid ${m.status === 'completed' ? '#bbf7d0' : 'var(--color-border)'}` }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: m.status === 'completed' ? '#16a34a' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }}>
                {m.status === 'completed' ? '✓' : (i + 1)}
              </div>
              <div style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: m.status === 'completed' ? '#16a34a' : 'var(--color-text-primary)', textDecoration: m.status === 'completed' ? 'line-through' : 'none' }}>{m.title}</div>
              <span className={`badge ${m.status === 'completed' ? 'badge-success' : 'badge-neutral'}`}>{m.status === 'completed' ? 'Done' : 'Pending'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
