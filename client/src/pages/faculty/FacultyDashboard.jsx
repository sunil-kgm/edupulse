import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_AT_RISK_STUDENTS, DEMO_FACULTY_REPORTS, DEMO_COURSES } from '../../data/mockData';
import { FiUsers, FiAlertTriangle, FiCalendar, FiFileText, FiFlag, FiEye, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const RISK_COLOR = { high: '#ef4444', medium: '#f97316', low: '#f59e0b' };

export default function FacultyDashboard() {
  const { user } = useAuth();
  const atRisk = DEMO_AT_RISK_STUDENTS;
  const reports = DEMO_FACULTY_REPORTS;

  const statsData = [
    { icon: <FiUsers size={20} color="#3b82f6" />, label: 'Total Students', value: 62, bg: '#eff6ff' },
    { icon: <FiAlertTriangle size={20} color="#ef4444" />, label: 'At-Risk Students', value: 3, bg: '#fef2f2' },
    { icon: <FiCalendar size={20} color="#f97316" />, label: 'Low Attendance', value: 8, bg: '#fff7ed' },
    { icon: <FiFileText size={20} color="#f59e0b" />, label: 'Incomplete Assignments', value: 14, bg: '#fffbeb' },
    { icon: <FiFlag size={20} color="#7c3aed" />, label: 'Pending Reports', value: 1, bg: '#f3e8ff' },
  ];

  const chartData = [
    { name: 'CS301', avg: 58, attendance: 71 },
    { name: 'CS302', avg: 74, attendance: 83 },
    { name: 'CS303', avg: 62, attendance: 69 },
    { name: 'CS304', avg: 81, attendance: 88 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Faculty Dashboard</div>
          <div className="page-subtitle">Who needs your attention today?</div>
        </div>
        <Link to="/reports" className="btn btn-primary">
          <FiFlag size={14} /> Report Academic Concern
        </Link>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '16px', marginBottom: '24px' }}>
        {statsData.map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              {s.icon}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart + Quick Links */}
      <div className="grid-2-1" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Class Performance Overview</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '13px' }} />
              <Bar dataKey="avg" fill="#16a34a" name="Avg Performance" radius={[4, 4, 0, 0]} />
              <Bar dataKey="attendance" fill="#3b82f6" name="Attendance %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'View At-Risk Students', path: '/at-risk', icon: '⚠️', color: '#ef4444' },
              { label: 'Mark Attendance', path: '/mark-attendance', icon: '📋', color: '#16a34a' },
              { label: 'Submit Faculty Report', path: '/reports', icon: '📝', color: '#7c3aed' },
              { label: 'Monitor Recovery', path: '/recovery-monitor', icon: '📈', color: '#f97316' },
            ].map(a => (
              <Link key={a.label} to={a.path} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', borderRadius: '10px', background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)', textDecoration: 'none', color: 'var(--color-text-primary)',
                fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = a.color + '10'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--color-bg-secondary)'; }}
              >
                <span style={{ fontSize: '20px' }}>{a.icon}</span>
                {a.label}
                <FiArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* At-Risk Table */}
      <div className="card" style={{ marginBottom: '24px', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title">At-Risk Students</div>
            <div className="card-subtitle">Students requiring immediate attention</div>
          </div>
          <Link to="/at-risk" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Attendance</th>
                <th>Performance</th>
                <th>Risk</th>
                <th>Reasons</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {atRisk.map(s => (
                <tr key={s._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar avatar-sm" style={{ background: `${RISK_COLOR[s.riskLevel]}20`, color: RISK_COLOR[s.riskLevel], border: `1.5px solid ${RISK_COLOR[s.riskLevel]}40` }}>
                        {s.name[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{s.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{s.class} · {s.rollNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: s.attendance < 75 ? '#ef4444' : '#16a34a' }}>{s.attendance}%</div>
                    <div className="progress-bar-container" style={{ width: '80px', marginTop: '4px' }}>
                      <div className="progress-bar-fill" style={{ width: `${s.attendance}%`, background: s.attendance < 75 ? '#ef4444' : 'var(--color-primary)' }} />
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: s.performance < 50 ? '#ef4444' : '#f97316' }}>{s.performance}%</div>
                  </td>
                  <td>
                    <span className={`badge badge-${s.riskLevel}-risk`}>
                      {s.riskLevel.charAt(0).toUpperCase() + s.riskLevel.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', maxWidth: '200px' }}>
                      {s.reasons.join(' · ')}
                    </div>
                  </td>
                  <td>
                    <Link to={`/at-risk`} className="btn btn-secondary btn-sm">
                      <FiEye size={12} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Faculty Reports</div>
          <Link to="/reports" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reports.slice(0, 2).map(r => (
            <div key={r._id} style={{
              padding: '16px', borderRadius: '12px',
              background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', gap: '16px'
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                background: r.severity === 'high' ? '#fef2f2' : r.severity === 'medium' ? '#fff7ed' : '#fffbeb',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px'
              }}>
                {r.severity === 'high' ? '🔴' : r.severity === 'medium' ? '🟠' : '🟡'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{r.student.name} — {r.course.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {r.concernType.replace(/_/g, ' ')} · Reported {r.createdAt}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <span className={`badge badge-${r.severity === 'high' ? 'error' : r.severity === 'medium' ? 'warning' : 'info'}`}>
                  {r.severity.charAt(0).toUpperCase() + r.severity.slice(1)} Severity
                </span>
                {r.parentAcknowledged
                  ? <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>✓ Acknowledged</span>
                  : <span style={{ fontSize: '11px', color: '#f97316', fontWeight: 600 }}>⏳ Awaiting Parent</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
