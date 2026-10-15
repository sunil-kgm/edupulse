import { useState } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

const AUDIT_LOGS = [
  { _id: 'a1', action: 'Faculty Report Submitted', user: 'Dr. Priya Nair', role: 'faculty', type: 'report', time: '2026-09-28 09:15', details: 'Submitted academic concern for student Arun Kumar (CS301)' },
  { _id: 'a2', action: 'Parent Acknowledged Report', user: 'Mr. Suresh Kumar', role: 'parent', type: 'ack', time: '2026-09-28 10:30', details: 'Acknowledged report report_001 for ward Arun Kumar' },
  { _id: 'a3', action: 'Risk Flag Triggered', user: 'System (Auto)', role: 'system', type: 'risk', time: '2026-09-28 08:00', details: 'High risk flag auto-generated for student Arun Kumar based on attendance 68%' },
  { _id: 'a4', action: 'Recovery Path Created', user: 'System', role: 'system', type: 'system', time: '2026-09-27 14:00', details: 'Recovery plan generated for student Arun Kumar (Data Structures)' },
  { _id: 'a5', action: 'User Login', user: 'Dr. Meena Sharma', role: 'hod', type: 'auth', time: '2026-09-27 09:00', details: 'HOD login from 192.168.1.10' },
  { _id: 'a6', action: 'Risk Config Updated', user: 'Dr. Admin Kumar', role: 'admin', type: 'admin', time: '2026-09-26 16:00', details: 'Updated attendance threshold: high risk < 60%' },
  { _id: 'a7', action: 'New Student Enrolled', user: 'Dr. Admin Kumar', role: 'admin', type: 'admin', time: '2026-09-25 11:00', details: 'Added student Rahul Singh to III CSE-B' },
  { _id: 'a8', action: 'Notification Sent', user: 'System', role: 'system', type: 'system', time: '2026-09-25 09:00', details: 'Attendance alert notification sent to parent of Arun Kumar' },
  { _id: 'a9', action: 'Faculty Report Submitted', user: 'Prof. Rajesh Iyer', role: 'faculty', type: 'report', time: '2026-09-24 15:30', details: 'Submitted low attendance concern for student Arun Kumar (CS302)' },
  { _id: 'a10', action: 'Quiz Created', user: 'Dr. Priya Nair', role: 'faculty', type: 'report', time: '2026-09-23 12:00', details: 'Created Data Structures Quiz 3 for III CSE-A' },
  { _id: 'a11', action: 'User Login', user: 'Dr. Priya Nair', role: 'faculty', type: 'auth', time: '2026-09-23 08:30', details: 'Faculty login from 192.168.1.14' },
  { _id: 'a12', action: 'Department Updated', user: 'Dr. Admin Kumar', role: 'admin', type: 'admin', time: '2026-09-22 13:00', details: 'Updated HOD for ECE department' },
];

const TYPE_CONFIG = {
  report: { color: '#f97316', bg: '#fff7ed', icon: '📝', label: 'Report' },
  ack: { color: '#16a34a', bg: '#f0fdf4', icon: '✅', label: 'Acknowledgement' },
  risk: { color: '#ef4444', bg: '#fef2f2', icon: '⚠️', label: 'Risk' },
  system: { color: '#3b82f6', bg: '#eff6ff', icon: '⚙️', label: 'System' },
  admin: { color: '#7c3aed', bg: '#f5f3ff', icon: '👤', label: 'Admin' },
  auth: { color: '#0ea5e9', bg: '#f0f9ff', icon: '🔑', label: 'Auth' },
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = AUDIT_LOGS.filter(log => {
    const matchSearch = log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || log.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Audit Logs</div>
          <div className="page-subtitle">{AUDIT_LOGS.length} events recorded · Showing {filtered.length}</div>
        </div>
      </div>

      {/* Type Summary */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <button
          onClick={() => setTypeFilter('all')}
          style={{ padding: '6px 14px', borderRadius: '99px', border: typeFilter === 'all' ? '2px solid #374151' : '1px solid var(--color-border)', background: typeFilter === 'all' ? '#f3f4f6' : 'white', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
        >All ({AUDIT_LOGS.length})</button>
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
          const count = AUDIT_LOGS.filter(l => l.type === type).length;
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}
              style={{ padding: '6px 14px', borderRadius: '99px', border: typeFilter === type ? `2px solid ${cfg.color}` : '1px solid var(--color-border)', background: typeFilter === type ? cfg.bg : 'white', fontSize: '12px', fontWeight: 700, color: typeFilter === type ? cfg.color : 'var(--color-text-muted)', cursor: 'pointer', transition: 'all 0.15s' }}
            >
              {cfg.icon} {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '400px' }}>
        <FiSearch size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <input className="form-input" style={{ paddingLeft: '40px' }} placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Log Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((log, i) => {
          const cfg = TYPE_CONFIG[log.type] || TYPE_CONFIG.system;
          return (
            <div key={log._id} style={{ display: 'flex', gap: '16px', padding: '16px 20px', background: 'white', border: '1px solid var(--color-border)', borderRadius: '14px', transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
            >
              <div style={{ width: 38, height: 38, borderRadius: '10px', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                {cfg.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>{log.action}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>{log.details}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px' }}>{log.time}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{log.user[0]}</div>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{log.user}</span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>({log.role})</span>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>No logs match your search.</div>
        )}
      </div>
    </div>
  );
}
