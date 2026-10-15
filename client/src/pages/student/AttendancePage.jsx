import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { getMyAttendance } from '../../services/api';
import { DEMO_ATTENDANCE } from '../../data/mockData';
import { FiAlertTriangle, FiCheck, FiRefreshCw } from 'react-icons/fi';

function CircularProgress({ percent, size = 120, strokeWidth = 10 }) {
  const color = percent >= 75 ? '#16a34a' : percent >= 60 ? '#f97316' : '#ef4444';
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f2f6" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: size * 0.19, fontWeight: 800, color, fontFamily: "'Space Grotesk',sans-serif" }}>{percent}%</div>
        <div style={{ fontSize: size * 0.1, color: 'var(--color-text-muted)' }}>Overall</div>
      </div>
    </div>
  );
}

// Normalise API response (records + summary) to the shape the UI expects
function normalise(apiData) {
  if (!apiData) return null;
  if (apiData.summary && Array.isArray(apiData.summary)) {
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
    const history = (apiData.records || []).slice(0, 20).map((r) => ({
      date: new Date(r.date).toLocaleDateString('en-IN'),
      course: r.course?.name || '',
      status: r.status,
    }));
    return { overall, present: presentClasses, absent: totalClasses - presentClasses, total: totalClasses, courses, history };
  }
  return apiData; // already normalised (mock shape)
}

export default function AttendancePage() {
  const { user, isDemo } = useAuth();

  const { data: raw, loading, refetch, isLive } = useApi(
    () => getMyAttendance(user?._id),
    DEMO_ATTENDANCE,
    [user?._id]
  );

  const att = normalise(raw) || DEMO_ATTENDANCE;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">Attendance</div>
            <div className="page-subtitle">Your attendance record across all courses</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isLive && <span className="badge badge-success" style={{ fontSize: '11px' }}>● Live</span>}
            {!isLive && !isDemo && <span className="badge badge-warning" style={{ fontSize: '11px' }}>Demo</span>}
            <button className="btn btn-secondary btn-sm" onClick={refetch} disabled={loading} title="Refresh">
              <FiRefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'Overall Attendance', value: `${att.overall}%`, color: '#f97316', icon: '📊' },
          { label: 'Classes Present', value: att.present, color: '#16a34a', icon: '✅' },
          { label: 'Classes Absent', value: att.absent, color: '#ef4444', icon: '❌' },
          { label: 'Total Classes', value: att.total, color: '#3b82f6', icon: '📅' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-1-2" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Circular summary */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <div className="card-title">Overall Attendance</div>
          <CircularProgress percent={att.overall} size={150} strokeWidth={12} />
          {att.overall < 75 && (
            <div style={{
              background: 'var(--color-error-bg)', border: '1px solid #fecaca',
              borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: 'var(--color-error)',
              display: 'flex', alignItems: 'center', gap: '8px', width: '100%'
            }}>
              <FiAlertTriangle size={16} />
              Attendance below required 75%. Risk of academic penalty.
            </div>
          )}
          {att.overall >= 75 && (
            <div style={{
              background: 'var(--color-success-bg)', border: '1px solid #bbf7d0',
              borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: 'var(--color-success)',
              display: 'flex', alignItems: 'center', gap: '8px', width: '100%'
            }}>
              <FiCheck size={16} /> Attendance meets the required threshold.
            </div>
          )}
        </div>

        {/* Course-wise */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Course-wise Attendance</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(att.courses || []).map((c, i) => {
              const color = c.percentage >= 75 ? '#16a34a' : c.percentage >= 60 ? '#f97316' : '#ef4444';
              return (
                <div key={c.course?._id || i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{c.course?.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{c.course?.code} · {c.present}/{c.total} classes</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 800, color }}>{c.percentage}%</span>
                      {c.isLow && <span className="badge badge-error" style={{ fontSize: '10px' }}>Low</span>}
                    </div>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${c.percentage}%`, background: `linear-gradient(135deg, ${color}, ${color}bb)` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent History */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Attendance History</div>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Course</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(att.history || []).map((h, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{h.date}</td>
                  <td>{h.course}</td>
                  <td>
                    <span className={`badge ${h.status === 'present' ? 'badge-success' : h.status === 'late' ? 'badge-warning' : 'badge-error'}`}>
                      {h.status === 'present' ? '✓ Present' : h.status === 'late' ? '⚠ Late' : '✗ Absent'}
                    </span>
                  </td>
                </tr>
              ))}
              {(att.history || []).length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>No attendance records yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
