import { DEMO_ADMIN_STATS, DEMO_AT_RISK_STUDENTS } from '../../data/mockData';
import { Link } from 'react-router-dom';
import { FiUsers, FiShield, FiSettings, FiBarChart2, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApi } from '../../hooks/useApi';
import { getDeptAnalytics } from '../../services/api';

const DEPT_DATA = [
  { dept: 'CSE', students: 280, atRisk: 18, attendance: 81 },
  { dept: 'ECE', students: 240, atRisk: 14, attendance: 79 },
  { dept: 'MECH', students: 220, atRisk: 22, attendance: 76 },
  { dept: 'CIVIL', students: 180, atRisk: 11, attendance: 83 },
  { dept: 'IT', students: 200, atRisk: 16, attendance: 80 },
  { dept: 'EEE', students: 120, atRisk: 8, attendance: 85 },
];

const AUDIT_LOGS = [
  { action: 'Faculty Report Submitted', user: 'Dr. Priya Nair', time: '10 minutes ago', type: 'report' },
  { action: 'Parent Acknowledged Report', user: 'Mr. Suresh Kumar', time: '2 hours ago', type: 'ack' },
  { action: 'Recovery Path Created', user: 'System', time: '5 hours ago', type: 'system' },
  { action: 'Risk Flag Triggered', user: 'System (Auto)', time: '1 day ago', type: 'risk' },
  { action: 'New Student Enrolled', user: 'Admin', time: '2 days ago', type: 'admin' },
];

export default function AdminDashboard() {
  const { data: liveStats, loading, refetch, isLive } = useApi(
    getDeptAnalytics,
    null
  );

  const stats = liveStats ? {
    totalStudents: liveStats.totalStudents ?? DEMO_ADMIN_STATS.totalStudents,
    totalFaculty: liveStats.totalFaculty ?? DEMO_ADMIN_STATS.totalFaculty,
    departments: DEMO_ADMIN_STATS.departments,
    atRiskStudents: liveStats.atRiskStudents ?? DEMO_ADMIN_STATS.atRiskStudents,
    avgAttendance: DEMO_ADMIN_STATS.avgAttendance,
    recoveryCompletion: DEMO_ADMIN_STATS.recoveryCompletion,
  } : DEMO_ADMIN_STATS;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">Administration Dashboard</div>
            <div className="page-subtitle">Institution-wide academic overview</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isLive && <span className="badge badge-success" style={{ fontSize: '11px' }}>● Live</span>}
            <button className="btn btn-secondary btn-sm" onClick={refetch} disabled={loading} title="Refresh data">
              <FiRefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Global Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { icon: '👨‍🎓', label: 'Total Students', value: stats.totalStudents.toLocaleString(), color: '#3b82f6' },
          { icon: '👨‍🏫', label: 'Total Faculty', value: stats.totalFaculty, color: '#7c3aed' },
          { icon: '🏛️', label: 'Departments', value: stats.departments, color: '#0ea5e9' },
          { icon: '⚠️', label: 'At-Risk Students', value: stats.atRiskStudents, color: '#ef4444' },
          { icon: '📅', label: 'Avg Attendance', value: `${stats.avgAttendance}%`, color: '#f97316' },
          { icon: '🛤️', label: 'Recovery Rate', value: `${stats.recoveryCompletion}%`, color: '#16a34a' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '3px', lineHeight: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts + Actions */}
      <div className="grid-2-1" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Department-wise At-Risk Students</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={DEPT_DATA} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="dept" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '13px' }} />
              <Bar dataKey="students" fill="#3b82f6" name="Total Students" radius={[4, 4, 0, 0]} />
              <Bar dataKey="atRisk" fill="#ef4444" name="At-Risk" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>Admin Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Manage Users', path: '/users', icon: '👥', color: '#3b82f6' },
              { label: 'Departments', path: '/departments', icon: '🏛️', color: '#7c3aed' },
              { label: 'Risk Configuration', path: '/risk-config', icon: '⚙️', color: '#ef4444' },
              { label: 'View Analytics', path: '/analytics', icon: '📊', color: '#16a34a' },
              { label: 'Audit Logs', path: '/audit-logs', icon: '📋', color: '#f97316' },
            ].map(a => (
              <Link key={a.label} to={a.path} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '10px', background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)', textDecoration: 'none',
                color: 'var(--color-text-primary)', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
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

      {/* Department Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <div className="card-title">Department Summary</div>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Students</th>
                <th>At-Risk</th>
                <th>Attendance</th>
                <th>Risk %</th>
              </tr>
            </thead>
            <tbody>
              {DEPT_DATA.map(d => (
                <tr key={d.dept}>
                  <td style={{ fontWeight: 600 }}>{d.dept}</td>
                  <td>{d.students}</td>
                  <td>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>{d.atRisk}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar-container" style={{ width: '80px' }}>
                        <div className="progress-bar-fill" style={{ width: `${d.attendance}%`, background: d.attendance < 80 ? '#f97316' : 'var(--color-primary)' }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>{d.attendance}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${d.atRisk / d.students > 0.1 ? 'badge-error' : 'badge-warning'}`}>
                      {((d.atRisk / d.students) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Audit Logs</div>
          <Link to="/audit-logs" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {AUDIT_LOGS.map((log, i) => {
            const typeColors = { report: '#f97316', ack: '#16a34a', system: '#3b82f6', risk: '#ef4444', admin: '#7c3aed' };
            const typeEmojis = { report: '📝', ack: '✅', system: '⚙️', risk: '⚠️', admin: '👤' };
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '10px',
                background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)',
              }}>
                <span style={{ fontSize: '18px' }}>{typeEmojis[log.type]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{log.action}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>by {log.user}</div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{log.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
