import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  DEMO_ASSIGNMENTS, DEMO_ATTENDANCE, DEMO_RISK_FLAG, DEMO_RECOVERY_PATH,
  DEMO_RESOURCES, DEMO_PERFORMANCE_CHART, DEMO_QUIZZES
} from '../../data/mockData';
import {
  getStudentAnalytics, getMyAttendance, getStudentRecovery, getStudentRiskFlags,
  getMyAssignments, getResources
} from '../../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { FiTrendingUp, FiCalendar, FiFileText, FiAlertTriangle, FiArrowRight, FiCheck, FiClock, FiBookOpen, FiStar, FiExternalLink, FiRefreshCw } from 'react-icons/fi';

function StatCard({ icon, label, value, sub, valueColor, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-card-icon" style={{ background: valueColor + '15' }}>
          {icon}
        </div>
      </div>
      <div className="stat-card-value" style={{ color: valueColor || 'var(--color-text-primary)' }}>{value}</div>
      <div className="stat-card-label">{label}</div>
      {sub && <div className="stat-card-change neutral">{sub}</div>}
      {trend && (
        <div className={`stat-card-change ${trend.dir}`}>
          {trend.dir === 'positive' ? '↑' : '↓'} {trend.text}
        </div>
      )}
    </div>
  );
}

function RiskBadge({ level }) {
  const cfg = {
    high: { class: 'badge-high-risk', label: 'High Risk', icon: '🔴' },
    medium: { class: 'badge-medium-risk', label: 'Medium Risk', icon: '🟠' },
    low: { class: 'badge-low-risk', label: 'Low Risk', icon: '🟡' },
    none: { class: 'badge-success', label: 'No Risk', icon: '🟢' },
  };
  const c = cfg[level] || cfg.none;
  return <span className={`badge ${c.class}`}>{c.icon} {c.label}</span>;
}

function CircularProgress({ percent, size = 100, strokeWidth = 8, color = '#16a34a' }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;

  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f2f6" strokeWidth={strokeWidth} />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }}
        />
      </svg>
      <div className="circular-progress-text">
        <div style={{ fontSize: size * 0.18, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color }}>{percent}%</div>
        <div style={{ fontSize: size * 0.1, color: 'var(--color-text-muted)' }}>Attendance</div>
      </div>
    </div>
  );
}

function MilestoneTimeline({ milestones }) {
  return (
    <div className="timeline">
      {milestones.map((m, i) => (
        <div key={m._id || i} className="timeline-item">
          <div className={`timeline-dot ${m.status}`}>
            {m.status === 'completed' && <FiCheck size={10} color="white" />}
            {m.status === 'current' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)' }} />}
          </div>
          <div className={`timeline-content ${m.status}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="timeline-title">{m.title}</div>
              <span className={`badge ${m.status === 'completed' ? 'badge-success' : m.status === 'current' ? 'badge-info' : 'badge-neutral'}`}>
                {m.status === 'completed' ? 'Done' : m.status === 'current' ? 'In Progress' : 'Pending'}
              </span>
            </div>
            <div className="timeline-desc">{m.description}</div>
            {m.dueDate && m.status !== 'completed' && (
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiClock size={10} /> Due: {m.dueDate}
              </div>
            )}
            {m.completedAt && (
              <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiCheck size={10} /> Completed {typeof m.completedAt === 'string' ? m.completedAt : new Date(m.completedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const typeIconMap = { video: '🎬', pdf: '📄', article: '📖', practice: '✏️', quiz_set: '📝' };

// ── Helper to normalise attendance from API or mock ──────────────
function normaliseAttendance(apiData, fallback) {
  // API returns { records, summary }; mock returns { overall, present, absent, total, courses, history }
  if (!apiData) return fallback;
  if (apiData.summary && Array.isArray(apiData.summary)) {
    // Compute overall from summary
    let totalClasses = 0, presentClasses = 0;
    const courses = apiData.summary.map((s) => ({
      course: s.course,
      present: s.present,
      total: s.total,
      absent: s.absent,
      percentage: s.percentage,
      isLow: s.percentage < 75,
    }));
    apiData.summary.forEach((s) => { totalClasses += s.total; presentClasses += s.present; });
    const overall = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
    const history = (apiData.records || []).slice(0, 15).map((r) => ({
      date: new Date(r.date).toLocaleDateString('en-IN'),
      course: r.course?.name || '',
      status: r.status,
    }));
    return { overall, present: presentClasses, absent: totalClasses - presentClasses, total: totalClasses, courses, history };
  }
  return fallback;
}

// ── Helper to normalise recovery from API or mock ─────────────────
function normaliseRecovery(apiData, fallback) {
  if (!apiData) return fallback;
  if (apiData.milestones) return apiData; // direct API shape
  return fallback;
}

export default function StudentDashboard() {
  const { user, isDemo } = useAuth();

  // ─── State (starts with mock, replaced by live data) ──────────
  const [attendance, setAttendance] = useState(DEMO_ATTENDANCE);
  const [risk, setRisk]             = useState(DEMO_RISK_FLAG);
  const [recovery, setRecovery]     = useState(DEMO_RECOVERY_PATH);
  const [assignments, setAssignments] = useState(DEMO_ASSIGNMENTS);
  const [resources, setResources]   = useState(DEMO_RESOURCES);
  const [analytics, setAnalytics]   = useState(null);
  const [dataLoading, setDataLoading] = useState(!isDemo);

  const loadData = useCallback(async () => {
    if (isDemo || !user?._id) return; // demo mode – keep mock data
    setDataLoading(true);
    try {
      const [attRes, riskRes, recRes, assignRes, resRes, analyticsRes] = await Promise.allSettled([
        getMyAttendance(user._id),
        getStudentRiskFlags(user._id),
        getStudentRecovery(user._id),
        getMyAssignments(user._id),
        getResources(),
        getStudentAnalytics(user._id),
      ]);

      if (attRes.status === 'fulfilled')
        setAttendance(normaliseAttendance(attRes.value.data, DEMO_ATTENDANCE));
      if (riskRes.status === 'fulfilled' && riskRes.value.data?.length)
        setRisk(riskRes.value.data[0]);
      if (recRes.status === 'fulfilled' && recRes.value.data)
        setRecovery(normaliseRecovery(recRes.value.data, DEMO_RECOVERY_PATH));
      if (assignRes.status === 'fulfilled')
        setAssignments(assignRes.value.data);
      if (resRes.status === 'fulfilled')
        setResources(resRes.value.data);
      if (analyticsRes.status === 'fulfilled')
        setAnalytics(analyticsRes.value.data);
    } finally {
      setDataLoading(false);
    }
  }, [user?._id, isDemo]);

  useEffect(() => { loadData(); }, [loadData]);

  // Compute derived stats
  const overallPerformance = analytics?.quizAverage ?? 44;
  const pendingAssignments = assignments.filter((a) => {
    // Handle both API shape (submissions) and mock shape
    const status = a.status || (a.assignment ? a.status : undefined);
    return status !== 'submitted' && status !== 'graded';
  });
  const completedCount = assignments.length - pendingAssignments.length;
  const assignmentCompletion = `${completedCount} / ${assignments.length}`;

  const attPercent = typeof attendance.overall === 'number' ? attendance.overall : DEMO_ATTENDANCE.overall;

  return (
    <div className="animate-fade-in">
      {/* Greeting Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">
              {new Date().getHours() < 12 ? 'Good morning' : 'Good afternoon'}, {user?.name?.split(' ')[0]}! 👋
            </div>
            <div className="page-subtitle">Here's your academic snapshot for today, {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isDemo && (
              <button className="btn btn-secondary btn-sm" onClick={loadData} disabled={dataLoading} title="Refresh data">
                <FiRefreshCw size={13} style={{ animation: dataLoading ? 'spin 1s linear infinite' : 'none' }} />
              </button>
            )}
            <RiskBadge level={risk?.level || 'none'} />
          </div>
        </div>
        {isDemo && (
          <div style={{ marginTop: '8px', padding: '6px 14px', background: '#fef9c3', border: '1px solid #fde047', borderRadius: '8px', fontSize: '12px', color: '#854d0e', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            🔶 Demo mode — showing sample data. Connect to the backend for live data.
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard
          icon={<FiTrendingUp size={20} color="#ef4444" />}
          label="Overall Performance"
          value={`${overallPerformance}%`}
          valueColor="#ef4444"
          sub="Below threshold (50%)"
        />
        <StatCard
          icon={<FiCalendar size={20} color="#f97316" />}
          label="Attendance"
          value={`${attPercent}%`}
          valueColor="#f97316"
          sub={attPercent < 75 ? 'Below required 75%' : 'Above threshold ✓'}
        />
        <StatCard
          icon={<FiFileText size={20} color="#3b82f6" />}
          label="Assignments"
          value={assignmentCompletion}
          valueColor="#3b82f6"
          sub={`${pendingAssignments.length} pending or overdue`}
        />
        <StatCard
          icon={<FiAlertTriangle size={20} color="#ef4444" />}
          label="Risk Status"
          value={risk?.level ? risk.level.charAt(0).toUpperCase() + risk.level.slice(1) : 'None'}
          valueColor={risk?.level === 'high' ? '#ef4444' : risk?.level === 'medium' ? '#f97316' : '#16a34a'}
          sub={risk?.detectedAt ? `Since ${new Date(risk.detectedAt).toLocaleDateString('en-IN')}` : 'No active risk'}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid-2-1" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Performance Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Academic Performance</div>
              <div className="card-subtitle">Quiz & Assignment scores over time</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={DEMO_PERFORMANCE_CHART}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '13px' }} />
              <Legend />
              <Line type="monotone" dataKey="quizScore" stroke="#16a34a" strokeWidth={2.5} dot={{ fill: '#16a34a', r: 4 }} name="Quiz" />
              <Line type="monotone" dataKey="assignmentScore" stroke="#3b82f6" strokeWidth={2.5} dot={{ fill: '#3b82f6', r: 4 }} name="Assignments" />
              <Line type="monotone" dataKey="overall" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#f97316', r: 3 }} name="Overall" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Attendance</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <CircularProgress
              percent={attPercent}
              size={120}
              strokeWidth={10}
              color={attPercent >= 75 ? '#16a34a' : attPercent >= 60 ? '#f97316' : '#ef4444'}
            />
            <div style={{ width: '100%' }}>
              {[
                { label: 'Present', value: attendance.present, color: '#16a34a' },
                { label: 'Absent', value: attendance.absent, color: '#ef4444' },
                { label: 'Total', value: attendance.total, color: 'var(--color-text-secondary)' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{s.label}</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
            <Link to="/attendance" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
              View Details <FiArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Risk Flag Alert */}
      {risk && risk.level && risk.level !== 'none' && (
        <div style={{
          background: '#fff5f5',
          border: '1.5px solid var(--color-high-risk-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-5) var(--space-6)',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-4)',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '12px',
            background: '#fef2f2', border: '1px solid #fecaca',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <FiAlertTriangle size={20} color="#ef4444" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#ef4444' }}>
                {risk.level.charAt(0).toUpperCase() + risk.level.slice(1)} Risk Detected
              </span>
              <span className="badge badge-high-risk">{risk.level.charAt(0).toUpperCase() + risk.level.slice(1)}</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
              Your academic performance has been flagged. The following concerns were identified:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(risk.reasons || []).map(r => (
                <span key={r} style={{
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: '99px', padding: '4px 12px', fontSize: '12px', color: '#ef4444', fontWeight: 600,
                }}>• {r}</span>
              ))}
            </div>
          </div>
          <Link to="/recovery" className="btn btn-danger btn-sm" style={{ flexShrink: 0 }}>
            Recovery Path
          </Link>
        </div>
      )}

      {/* Academic Backlog + Recovery */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Pending Work */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Pending Academic Work</div>
              <div className="card-subtitle">Backlogs requiring attention</div>
            </div>
            <Link to="/assignments" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {pendingAssignments.slice(0, 4).map((a, idx) => {
              // Normalise between API shape (submission obj) and mock (assignment obj)
              const title = a.assignment?.title || a.title || 'Untitled';
              const courseName = a.assignment?.course?.name || a.course?.name || '—';
              const dueDate = a.assignment?.dueDate || a.dueDate || '—';
              const status = a.status || 'pending';
              const statusCfg = {
                incomplete: { class: 'badge-warning', label: 'Incomplete' },
                overdue: { class: 'badge-error', label: 'Overdue' },
                pending: { class: 'badge-info', label: 'Pending' },
                not_submitted: { class: 'badge-warning', label: 'Not Submitted' },
              };
              const sc = statusCfg[status] || { class: 'badge-neutral', label: status };
              return (
                <div key={a._id || idx} style={{
                  padding: 'var(--space-4)',
                  background: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{title}</div>
                    <span className={`badge ${sc.class}`}>{sc.label}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{courseName}</div>
                  <div style={{ fontSize: '11px', color: status === 'overdue' ? 'var(--color-error)' : 'var(--color-text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiClock size={10} /> Due: {dueDate}
                  </div>
                </div>
              );
            })}
            {pendingAssignments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>All caught up!</div>
              </div>
            )}
          </div>
        </div>

        {/* Recovery Path Preview */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recovery Path</div>
              <div className="card-subtitle">{recovery.progressPercent}% complete</div>
            </div>
            <Link to="/recovery" className="btn btn-secondary btn-sm">View Full</Link>
          </div>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
              <span>Progress</span>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{recovery.progressPercent}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${recovery.progressPercent}%` }} />
            </div>
          </div>
          <MilestoneTimeline milestones={(recovery.milestones || []).slice(0, 4)} />
        </div>
      </div>

      {/* Recommended Resources */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Recommended Resources</div>
            <div className="card-subtitle">Curated for your weak areas</div>
          </div>
          <Link to="/resources" className="btn btn-secondary btn-sm">All Resources</Link>
        </div>
        <div className="grid-3">
          {resources.map((r, idx) => (
            <div key={r._id || idx} style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '22px' }}>{typeIconMap[r.type] || '📚'}</span>
                <span className="badge badge-info" style={{ fontSize: '10px' }}>{r.type?.toUpperCase()}</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{r.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>{r.course?.name || r.subject}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '10px', lineHeight: 1.4 }}>{r.description}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: '#f59e0b' }}>
                  <FiStar size={12} fill="#f59e0b" /> {r.rating || '—'}
                </div>
                <a href={r.url || '#'} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ fontSize: '11px', padding: '4px 10px' }}>
                  Open <FiExternalLink size={10} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
