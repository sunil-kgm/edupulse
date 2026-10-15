import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { getDeptAnalytics } from '../services/api';
import { FiRefreshCw } from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';

const MONTHLY_ATTENDANCE = [
  { month: 'Jan', attendance: 86, performance: 78 },
  { month: 'Feb', attendance: 84, performance: 80 },
  { month: 'Mar', attendance: 82, performance: 76 },
  { month: 'Apr', attendance: 88, performance: 82 },
  { month: 'May', attendance: 79, performance: 74 },
  { month: 'Jun', attendance: 85, performance: 81 },
  { month: 'Jul', attendance: 87, performance: 83 },
  { month: 'Aug', attendance: 83, performance: 79 },
  { month: 'Sep', attendance: 81, performance: 77 },
];

const CLASS_PERFORMANCE = [
  { class: 'I CSE-A', avg: 82, attendance: 88, atRisk: 4 },
  { class: 'I CSE-B', avg: 79, attendance: 85, atRisk: 6 },
  { class: 'II CSE-A', avg: 76, attendance: 82, atRisk: 8 },
  { class: 'III CSE-A', avg: 73, attendance: 79, atRisk: 10 },
  { class: 'III CSE-B', avg: 71, attendance: 76, atRisk: 12 },
  { class: 'IV CSE-A', avg: 80, attendance: 83, atRisk: 5 },
];

const RISK_TREND = [
  { month: 'Jun', high: 8, medium: 14, low: 10 },
  { month: 'Jul', high: 10, medium: 15, low: 11 },
  { month: 'Aug', high: 9, medium: 13, low: 9 },
  { month: 'Sep', high: 12, medium: 16, low: 13 },
];

const DEPT_COMPARISON = [
  { dept: 'CSE', attendance: 81, performance: 78, atRisk: 18 },
  { dept: 'ECE', attendance: 79, performance: 74, atRisk: 14 },
  { dept: 'MECH', attendance: 76, performance: 71, atRisk: 22 },
  { dept: 'CIVIL', attendance: 83, performance: 80, atRisk: 11 },
  { dept: 'IT', attendance: 80, performance: 76, atRisk: 16 },
  { dept: 'EEE', attendance: 85, performance: 82, atRisk: 8 },
];

const SUBJECT_SCORES = [
  { subject: 'Data Structures', avg: 72, pass: 88 },
  { subject: 'DBMS', avg: 78, pass: 91 },
  { subject: 'OS', avg: 69, pass: 84 },
  { subject: 'CN', avg: 74, pass: 87 },
  { subject: 'Math', avg: 65, pass: 80 },
];

const RISK_PIE = [
  { name: 'High Risk', value: 12 },
  { name: 'Medium Risk', value: 16 },
  { name: 'Low Risk', value: 13 },
  { name: 'No Risk', value: 240 },
];
const PIE_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#16a34a'];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch live department analytics
  const { data: deptStats, loading: statsLoading, refetch, isLive } = useApi(
    getDeptAnalytics,
    null
  );

  const tabs = [
    { id: 'overview', label: '\uD83D\uDCCA Overview' },
    { id: 'attendance', label: '\uD83D\uDCC5 Attendance' },
    { id: 'performance', label: '\uD83C\uDFC6 Performance' },
    { id: 'risk', label: '\u26A0\uFE0F Risk Analysis' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">Analytics</div>
            <div className="page-subtitle">
              {isAdmin ? 'Institution-wide academic analytics' : 'CSE Department \u2014 Academic Year 2026'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {isLive && <span className="badge badge-success" style={{ fontSize: '11px' }}>● Live</span>}
            <button className="btn btn-secondary btn-sm" onClick={refetch} disabled={statsLoading} title="Refresh">
              <FiRefreshCw size={13} style={{ animation: statsLoading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
            <select className="form-select" style={{ width: 'auto' }}>
              <option>Academic Year 2026</option>
              <option>Academic Year 2025</option>
            </select>
            <select className="form-select" style={{ width: 'auto' }}>
              <option>All Semesters</option>
              <option>Semester 5</option>
              <option>Semester 3</option>
              <option>Semester 1</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Dept. Attendance', value: '81%', sub: '\u2191 2% from last month', color: '#3b82f6', icon: '\uD83D\uDCC5' },
          { label: 'Avg Performance', value: '76%', sub: '\u2191 1.5% from last term', color: '#16a34a', icon: '\uD83C\uDFC6' },
          { label: 'At-Risk Students', value: '41', sub: '12 high \u00B7 16 medium \u00B7 13 low', color: '#ef4444', icon: '\u26A0\uFE0F' },
          { label: 'Recovery Rate', value: '68%', sub: 'Of at-risk back on track', color: '#7c3aed', icon: '\uD83D\uDEE4\uFE0F' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '26px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-primary)', fontWeight: 600, marginTop: '4px' }}>{s.label}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--color-bg-secondary)', padding: '4px', borderRadius: '12px', width: 'fit-content', border: '1px solid var(--color-border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
              background: activeTab === tab.id ? 'white' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
              boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid-2" style={{ marginBottom: '24px' }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Monthly Attendance & Performance Trend</div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={MONTHLY_ATTENDANCE}>
                  <defs>
                    <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[60, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '13px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="attendance" stroke="#3b82f6" fill="url(#attGrad)" strokeWidth={2} name="Attendance %" dot={{ r: 4 }} />
                  <Area type="monotone" dataKey="performance" stroke="#16a34a" fill="url(#perfGrad)" strokeWidth={2} name="Performance %" dot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Risk Distribution</div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={RISK_PIE} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                    label={({ value }) => `${value}`}>
                    {RISK_PIE.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px' }}>
                {RISK_PIE.map((r, i) => (
                  <div key={r.name} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: PIE_COLORS[i], fontFamily: "'Space Grotesk',sans-serif" }}>{r.value}</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{r.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <div className="card-title">Class-wise Performance Overview</div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={CLASS_PERFORMANCE} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="class" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '13px' }} />
                <Legend />
                <Bar dataKey="avg" fill="#16a34a" name="Avg Score %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attendance" fill="#3b82f6" name="Attendance %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="atRisk" fill="#ef4444" name="At-Risk Count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <div className="card-title">Subject-wise Performance</div>
            </div>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th><th>Average Score</th><th>Pass Rate</th><th>Score Bar</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {SUBJECT_SCORES.map(s => (
                    <tr key={s.subject}>
                      <td style={{ fontWeight: 600 }}>{s.subject}</td>
                      <td style={{ fontWeight: 700, color: s.avg < 70 ? '#ef4444' : '#16a34a' }}>{s.avg}%</td>
                      <td>{s.pass}%</td>
                      <td style={{ width: '160px' }}>
                        <div className="progress-bar-container">
                          <div className="progress-bar-fill" style={{ width: `${s.avg}%`, background: s.avg < 70 ? '#f97316' : 'var(--color-primary)' }} />
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${s.avg >= 75 ? 'badge-success' : s.avg >= 65 ? 'badge-warning' : 'badge-error'}`}>
                          {s.avg >= 75 ? 'Good' : s.avg >= 65 ? 'Average' : 'Needs Attention'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div>
          <div className="grid-2" style={{ marginBottom: '24px' }}>
            <div className="card">
              <div className="card-header"><div className="card-title">Monthly Attendance Trend</div></div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={MONTHLY_ATTENDANCE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[70, 95]} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '13px' }} />
                  <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: '#3b82f6' }} name="Attendance %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">Class-wise Attendance</div></div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={CLASS_PERFORMANCE} barSize={28} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" domain={[60, 100]} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="class" type="category" tick={{ fontSize: 11 }} width={75} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '13px' }} />
                  <Bar dataKey="attendance" fill="#3b82f6" name="Attendance %" radius={[0, 4, 4, 0]}
                    label={{ position: 'right', fontSize: 12, fontWeight: 700, formatter: v => `${v}%` }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <div className="card-title">Attendance Breakdown by Class</div>
            </div>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="data-table">
                <thead><tr><th>Class</th><th>Attendance %</th><th>At-Risk</th><th>Progress</th><th>Alert</th></tr></thead>
                <tbody>
                  {CLASS_PERFORMANCE.map(c => (
                    <tr key={c.class}>
                      <td style={{ fontWeight: 600 }}>{c.class}</td>
                      <td style={{ fontWeight: 700 }}>{c.attendance}%</td>
                      <td><span style={{ color: '#ef4444', fontWeight: 700 }}>{c.atRisk}</span></td>
                      <td style={{ width: '160px' }}>
                        <div className="progress-bar-container">
                          <div className="progress-bar-fill" style={{ width: `${c.attendance}%`, background: c.attendance < 80 ? '#f97316' : 'var(--color-primary)' }} />
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${c.attendance >= 85 ? 'badge-success' : c.attendance >= 75 ? 'badge-warning' : 'badge-error'}`}>
                          {c.attendance >= 85 ? 'Good' : c.attendance >= 75 ? 'Monitor' : 'Critical'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div>
          {isAdmin && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="card-header"><div className="card-title">Department-wise Comparison</div></div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={DEPT_COMPARISON} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="dept" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[60, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '13px' }} />
                  <Legend />
                  <Bar dataKey="attendance" fill="#3b82f6" name="Attendance %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="performance" fill="#16a34a" name="Performance %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="card">
            <div className="card-header"><div className="card-title">Subject Performance Details</div></div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={SUBJECT_SCORES} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '13px' }} />
                <Legend />
                <Bar dataKey="avg" fill="#7c3aed" name="Avg Score" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pass" fill="#16a34a" name="Pass Rate %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Risk Analysis Tab */}
      {activeTab === 'risk' && (
        <div>
          <div className="grid-2" style={{ marginBottom: '24px' }}>
            <div className="card">
              <div className="card-header"><div className="card-title">Risk Level Trend (Monthly)</div></div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={RISK_TREND}>
                  <defs>
                    <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="medGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '13px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="high" stroke="#ef4444" fill="url(#highGrad)" strokeWidth={2} name="High Risk" />
                  <Area type="monotone" dataKey="medium" stroke="#f97316" fill="url(#medGrad)" strokeWidth={2} name="Medium Risk" />
                  <Area type="monotone" dataKey="low" stroke="#f59e0b" strokeWidth={2} name="Low Risk" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">Risk Distribution</div></div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={RISK_PIE} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                    {RISK_PIE.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
              <div className="card-title">At-Risk Students by Class</div>
            </div>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="data-table">
                <thead><tr><th>Class</th><th>Total Students</th><th>At-Risk</th><th>Risk %</th><th>Bar</th></tr></thead>
                <tbody>
                  {[
                    { class: 'I CSE-A', total: 60, atRisk: 4 },
                    { class: 'I CSE-B', total: 58, atRisk: 6 },
                    { class: 'II CSE-A', total: 55, atRisk: 8 },
                    { class: 'III CSE-A', total: 52, atRisk: 10 },
                    { class: 'III CSE-B', total: 50, atRisk: 12 },
                    { class: 'IV CSE-A', total: 48, atRisk: 5 },
                  ].map(r => {
                    const pct = ((r.atRisk / r.total) * 100).toFixed(1);
                    return (
                      <tr key={r.class}>
                        <td style={{ fontWeight: 600 }}>{r.class}</td>
                        <td>{r.total}</td>
                        <td><span style={{ color: '#ef4444', fontWeight: 700 }}>{r.atRisk}</span></td>
                        <td>
                          <span className={`badge ${parseFloat(pct) > 15 ? 'badge-error' : parseFloat(pct) > 10 ? 'badge-warning' : 'badge-success'}`}>
                            {pct}%
                          </span>
                        </td>
                        <td style={{ width: '120px' }}>
                          <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${pct * 4}%`, background: parseFloat(pct) > 15 ? '#ef4444' : parseFloat(pct) > 10 ? '#f97316' : '#16a34a' }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
