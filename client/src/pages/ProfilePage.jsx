import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiBook, FiCalendar, FiShield } from 'react-icons/fi';

const ROLE_LABELS = {
  admin: { label: 'Administrator', color: '#7c3aed', bg: '#f3e8ff' },
  hod: { label: 'Head of Department', color: '#0ea5e9', bg: '#e0f2fe' },
  faculty: { label: 'Faculty Member', color: '#16a34a', bg: '#dcfce7' },
  student: { label: 'Student', color: '#f97316', bg: '#fff7ed' },
  parent: { label: 'Parent / Guardian', color: '#ec4899', bg: '#fdf2f8' },
};

export default function ProfilePage() {
  const { user } = useAuth();
  const roleConf = ROLE_LABELS[user?.role] || ROLE_LABELS.student;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';

  const fields = [
    { label: 'Full Name', value: user?.name, icon: FiUser },
    { label: 'Email', value: user?.email, icon: FiMail },
    { label: 'Role', value: roleConf.label, icon: FiShield },
    { label: 'Department', value: user?.department?.name || '—', icon: FiBook },
    ...(user?.rollNumber ? [{ label: 'Roll Number', value: user.rollNumber, icon: FiCalendar }] : []),
    ...(user?.class ? [{ label: 'Class', value: user.class, icon: FiBook }] : []),
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '640px' }}>
      <div className="page-header">
        <div className="page-title">My Profile</div>
        <div className="page-subtitle">Your EduPulse account information</div>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: `linear-gradient(135deg, ${roleConf.color}, ${roleConf.color}99)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', fontWeight: 800, color: 'white',
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>{user?.name}</div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '4px 12px', borderRadius: '99px',
              background: roleConf.bg, color: roleConf.color,
              fontSize: '13px', fontWeight: 700,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: roleConf.color }} />
              {roleConf.label}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {fields.map(f => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', background: 'var(--color-bg-secondary)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <f.icon size={16} color="var(--color-text-muted)" />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>{f.label}</div>
                <div style={{ fontSize: '15px', fontWeight: 600 }}>{f.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px 18px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
        🔐 For account changes, please contact your EduPulse administrator.
      </div>
    </div>
  );
}
