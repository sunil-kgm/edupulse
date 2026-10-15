import { FiCheck, FiX, FiShield } from 'react-icons/fi';

const ROLES = [
  { role: 'admin', label: 'Administrator', icon: '🛡️', color: '#7c3aed', users: 1, desc: 'Full system access across all departments and configurations.' },
  { role: 'hod', label: 'Head of Department', icon: '🎓', color: '#0ea5e9', users: 6, desc: 'Department-level oversight: faculty, classes, timetable, analytics.' },
  { role: 'faculty', label: 'Faculty Member', icon: '👨‍🏫', color: '#16a34a', users: 5, desc: 'Manages courses, student risk, reports and recovery plans.' },
  { role: 'student', label: 'Student', icon: '📚', color: '#f97316', users: 280, desc: 'Access to courses, assignments, quizzes, attendance, and recovery.' },
  { role: 'parent', label: 'Parent / Guardian', icon: '👨‍👩‍👧', color: '#ec4899', users: 240, desc: 'Monitors ward’s academic status, views reports and acknowledges them.' },
];

const PERMISSIONS = [
  { label: 'View Dashboard', admin: true, hod: true, faculty: true, student: true, parent: true },
  { label: 'Manage Users', admin: true, hod: false, faculty: false, student: false, parent: false },
  { label: 'Manage Departments', admin: true, hod: false, faculty: false, student: false, parent: false },
  { label: 'Configure Risk Rules', admin: true, hod: false, faculty: false, student: false, parent: false },
  { label: 'View Audit Logs', admin: true, hod: false, faculty: false, student: false, parent: false },
  { label: 'View Department Analytics', admin: true, hod: true, faculty: false, student: false, parent: false },
  { label: 'Manage Faculty', admin: true, hod: true, faculty: false, student: false, parent: false },
  { label: 'View All Classes', admin: true, hod: true, faculty: false, student: false, parent: false },
  { label: 'Manage Courses', admin: true, hod: true, faculty: true, student: false, parent: false },
  { label: 'View At-Risk Students', admin: true, hod: true, faculty: true, student: false, parent: false },
  { label: 'Submit Faculty Reports', admin: false, hod: false, faculty: true, student: false, parent: false },
  { label: 'Monitor Recovery Plans', admin: true, hod: true, faculty: true, student: false, parent: false },
  { label: 'View Own Courses', admin: false, hod: false, faculty: false, student: true, parent: false },
  { label: 'View Own Attendance', admin: false, hod: false, faculty: false, student: true, parent: false },
  { label: 'Take Quizzes', admin: false, hod: false, faculty: false, student: true, parent: false },
  { label: 'View Ward’s Info', admin: false, hod: false, faculty: false, student: false, parent: true },
  { label: 'Acknowledge Reports', admin: false, hod: false, faculty: false, student: false, parent: true },
  { label: 'View Notifications', admin: true, hod: true, faculty: true, student: true, parent: true },
];

const ROLE_COLORS = { admin: '#7c3aed', hod: '#0ea5e9', faculty: '#16a34a', student: '#f97316', parent: '#ec4899' };

export default function RolesPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Role Management</div>
          <div className="page-subtitle">System roles and permission matrix</div>
        </div>
      </div>

      {/* Role Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {ROLES.map(r => (
          <div key={r.role} className="card" style={{ borderTop: `3px solid ${r.color}` }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{r.icon}</div>
            <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{r.label}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '10px', lineHeight: 1.5 }}>{r.desc}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{r.users} user{r.users !== 1 ? 's' : ''}</span>
              <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: r.color + '15', color: r.color }}>{r.role}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Matrix */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <div className="card-title">Permission Matrix</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-secondary)' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--color-border)' }}>Permission</th>
                {ROLES.map(r => (
                  <th key={r.role} style={{ padding: '14px 16px', textAlign: 'center', fontSize: '12px', fontWeight: 700, borderBottom: '1px solid var(--color-border)', color: r.color }}>
                    {r.icon} {r.label.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((perm, i) => (
                <tr key={perm.label} style={{ background: i % 2 === 0 ? 'white' : 'var(--color-bg-secondary)' }}>
                  <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--color-border-light)' }}>{perm.label}</td>
                  {ROLES.map(r => (
                    <td key={r.role} style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid var(--color-border-light)' }}>
                      {perm[r.role]
                        ? <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: '#dcfce7' }}><FiCheck size={13} color="#16a34a" strokeWidth={3} /></div>
                        : <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: '#fee2e2' }}><FiX size={13} color="#ef4444" strokeWidth={3} /></div>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
