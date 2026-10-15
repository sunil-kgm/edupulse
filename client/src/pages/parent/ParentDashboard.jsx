import { Link } from 'react-router-dom';
import {
  DEMO_ATTENDANCE, DEMO_ASSIGNMENTS, DEMO_QUIZZES,
  DEMO_RECOVERY_PATH, DEMO_FACULTY_REPORTS, DEMO_COURSES,
} from '../../data/mockData';
import { FiFlag, FiArrowRight, FiCheck } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const PERF_DATA = [
  { month: 'Jul', performance: 75, attendance: 82 },
  { month: 'Aug', performance: 68, attendance: 75 },
  { month: 'Sep', performance: 44, attendance: 68 },
];

export default function ParentDashboard() {
  const att = DEMO_ATTENDANCE;
  const courses = DEMO_COURSES;
  const assignments = DEMO_ASSIGNMENTS;
  const quizzes = DEMO_QUIZZES;
  const reports = DEMO_FACULTY_REPORTS;
  const recovery = DEMO_RECOVERY_PATH;

  const pendingReports = reports.filter(r => !r.parentAcknowledged).length;
  const completedAssignments = assignments.filter(a => a.status === 'submitted').length;
  const attemptedQuizzes = quizzes.filter(q => q.attempt);
  const quizAvg = attemptedQuizzes.length
    ? Math.round(attemptedQuizzes.reduce((s, q) => s + q.attempt.percentage, 0) / attemptedQuizzes.length)
    : 44;
  const recoveryItems = recovery?.milestones || [];
  const recoveryPct = recovery?.progressPercent ?? (
    recoveryItems.length
      ? Math.round((recoveryItems.filter(m => m.status === 'completed').length / recoveryItems.length) * 100)
      : 0
  );

  return (
    <div className="animate-fade-in">

      {/* ── Pending Alert Banner ── */}
      {pendingReports > 0 && (
        <div style={{
          background: '#fff7ed', border: '1.5px solid #fed7aa',
          borderRadius: '14px', padding: '16px 20px', marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <FiFlag size={20} color="#f97316" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#f97316' }}>Action Required — Faculty Report Pending Acknowledgement</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Dr. Priya Nair has submitted an academic concern report that requires your review and acknowledgement.
            </div>
          </div>
          <Link to="/faculty-reports" className="btn btn-sm" style={{ background: '#f97316', color: 'white', flexShrink: 0 }}>
            Review Now <FiArrowRight size={12} />
          </Link>
        </div>
      )}

      {/* ── Quick Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { icon: '📚', label: 'Courses Enrolled', value: courses.length, color: '#3b82f6', sub: 'This semester' },
          { icon: '📝', label: 'Assignments', value: `${completedAssignments}/${assignments.length}`, color: '#16a34a', sub: `${assignments.length - completedAssignments} pending` },
          { icon: '✏️', label: 'Quiz Average', value: `${quizAvg}%`, color: quizAvg < 60 ? '#ef4444' : '#f97316', sub: 'Across all quizzes' },
          { icon: '📅', label: 'Attendance', value: `${att.overall}%`, color: att.overall < 75 ? '#ef4444' : '#16a34a', sub: att.overall < 75 ? 'Below required 75%' : 'Above threshold' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '26px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '11px', color: s.color, marginTop: '4px', fontWeight: 600 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Performance Trend + Quick Nav ── */}
      <div className="grid-2-1" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Academic Performance Trend</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={PERF_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '13px' }} />
              <Legend />
              <Line type="monotone" dataKey="performance" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 4 }} name="Performance" />
              <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} name="Attendance" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>Quick Navigation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Academic Backlog', path: '/academic-backlog', icon: '📋', badge: '3' },
              { label: 'Faculty Reports', path: '/faculty-reports', icon: '📝', badge: pendingReports > 0 ? `${pendingReports} Pending` : null },
              { label: 'Attendance Details', path: '/attendance', icon: '📅', badge: null },
              { label: 'Recovery Progress', path: '/recovery-progress', icon: '📈', badge: null },
              { label: 'Acknowledgement History', path: '/acknowledgement-history', icon: '✅', badge: null },
            ].map(a => (
              <Link key={a.label} to={a.path} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '10px', background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)', textDecoration: 'none', color: 'var(--color-text-primary)',
                fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'var(--color-primary-lighter)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--color-bg-secondary)'; }}
              >
                <span>{a.icon}</span>
                <span style={{ flex: 1 }}>{a.label}</span>
                {a.badge && <span className="badge badge-error" style={{ fontSize: '10px' }}>{a.badge}</span>}
                <FiArrowRight size={14} style={{ color: 'var(--color-text-muted)' }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Course-wise Performance ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <div className="card-title">Course-wise Performance</div>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Code</th>
                <th>Faculty</th>
                <th>Quiz Score</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td><span className="badge badge-info">{c.code}</span></td>
                  <td style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{c.faculty.name}</td>
                  <td style={{ fontWeight: 700, color: (c.quizScore || 0) < 50 ? '#ef4444' : '#16a34a' }}>
                    {c.quizScore != null ? `${c.quizScore}%` : '—'}
                  </td>
                  <td style={{ width: '140px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar-container" style={{ flex: 1 }}>
                        <div className="progress-bar-fill" style={{ width: `${c.progress}%`, background: c.progress < 50 ? '#f97316' : 'var(--color-primary)' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700 }}>{c.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${(c.quizScore || 0) >= 60 ? 'badge-success' : (c.quizScore || 0) >= 40 ? 'badge-warning' : 'badge-error'}`}>
                      {(c.quizScore || 0) >= 60 ? 'Good' : (c.quizScore || 0) >= 40 ? 'At Risk' : 'Critical'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Attendance by Course ── */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title">Course Attendance Overview</div>
          <Link to="/attendance" className="btn btn-secondary btn-sm">Full Details</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {att.courses.map(c => (
            <div key={c.course._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{c.course.name}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: c.percentage < 75 ? '#ef4444' : '#16a34a' }}>
                  {c.percentage}% {c.isLow && '⚠️'}
                </span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${c.percentage}%`, background: c.percentage < 75 ? '#ef4444' : 'var(--color-primary)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recovery Milestones ── */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Recovery Plan Status</div>
          <Link to="/recovery-progress" className="btn btn-secondary btn-sm">View Full Plan</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recoveryItems.slice(0, 4).map((m, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
              background: m.status === 'completed' ? '#f0fdf4' : 'var(--color-bg-secondary)',
              borderRadius: '10px',
              border: `1px solid ${m.status === 'completed' ? '#bbf7d0' : 'var(--color-border)'}`,
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: m.status === 'completed' ? '#16a34a' : '#e5e7eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
              }}>
                {m.status === 'completed' ? <FiCheck size={12} color="white" /> : (i + 1)}
              </div>
              <div style={{
                flex: 1, fontSize: '13px', fontWeight: 600,
                color: m.status === 'completed' ? '#16a34a' : 'var(--color-text-primary)',
                textDecoration: m.status === 'completed' ? 'line-through' : 'none',
              }}>{m.title}</div>
              <span className={`badge ${m.status === 'completed' ? 'badge-success' : 'badge-neutral'}`}>
                {m.status === 'completed' ? 'Done' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
