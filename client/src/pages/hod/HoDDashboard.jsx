import { useAuth } from '../../context/AuthContext';
import { DEMO_HOD_STATS, DEMO_AT_RISK_STUDENTS } from '../../data/mockData';
import { FiUsers, FiBook, FiBarChart2, FiAlertTriangle, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#ef4444', '#f97316', '#f59e0b'];

export default function HoDDashboard() {
  const { user } = useAuth();
  const stats = DEMO_HOD_STATS;

  const classPerformanceData = stats.classPerformance.map(c => ({
    name: c.class,
    Performance: c.avg,
    Attendance: c.attendance,
  }));

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Department Overview</div>
          <div className="page-subtitle">Computer Science & Engineering — Academic Year 2026</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { icon: '👨‍🎓', label: 'Total Students', value: stats.totalStudents, color: '#3b82f6' },
          { icon: '👨‍🏫', label: 'Faculty Members', value: stats.totalFaculty, color: '#7c3aed' },
          { icon: '📚', label: 'Active Classes', value: stats.totalClasses, color: '#16a34a' },
          { icon: '⚠️', label: 'At-Risk Students', value: stats.atRiskStudents, color: '#ef4444' },
          { icon: '📅', label: 'Dept. Attendance', value: `${stats.departmentAttendance}%`, color: '#f97316' },
          { icon: '📊', label: 'Avg Performance', value: `${stats.avgPerformance}%`, color: '#0ea5e9' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '3px', lineHeight: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Class Performance Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Class Performance & Attendance</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={classPerformanceData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '13px' }} />
              <Legend />
              <Bar dataKey="Performance" fill="#16a34a" name="Avg Performance" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Attendance" fill="#3b82f6" name="Attendance %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution Pie */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Risk Distribution</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.riskDistribution}
                dataKey="count"
                nameKey="level"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ level, count }) => `${level}: ${count}`}
              >
                {stats.riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '8px' }}>
            {stats.riskDistribution.map((r, i) => (
              <div key={r.level} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: COLORS[i], fontFamily: "'Space Grotesk',sans-serif" }}>{r.count}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{r.level}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'View At-Risk Students', path: '/at-risk', icon: '⚠️', color: '#ef4444' },
              { label: 'Analytics Report', path: '/analytics', icon: '📊', color: '#3b82f6' },
              { label: 'Manage Faculty', path: '/faculty', icon: '👨‍🏫', color: '#7c3aed' },
              { label: 'View Timetable', path: '/timetable', icon: '📅', color: '#16a34a' },
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
                <span style={{ fontSize: '20px' }}>{a.icon}</span>
                <span style={{ flex: 1 }}>{a.label}</span>
                <FiArrowRight size={14} style={{ color: 'var(--color-text-muted)' }} />
              </Link>
            ))}
          </div>
        </div>

        {/* At Risk Summary */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Top At-Risk Students</div>
            <Link to="/at-risk" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DEMO_AT_RISK_STUDENTS.map(s => (
              <div key={s._id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px', borderRadius: '10px', background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
              }}>
                <div className="avatar avatar-sm" style={{
                  background: s.riskLevel === 'high' ? '#fef2f2' : s.riskLevel === 'medium' ? '#fff7ed' : '#fffbeb',
                  color: s.riskLevel === 'high' ? '#ef4444' : s.riskLevel === 'medium' ? '#f97316' : '#f59e0b',
                }}>
                  {s.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{s.class}</div>
                </div>
                <span className={`badge badge-${s.riskLevel}-risk`} style={{ fontSize: '10px' }}>
                  {s.riskLevel.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
