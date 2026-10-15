import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import {
  FiGrid, FiBook, FiFileText, FiCheckSquare, FiCalendar,
  FiAlertTriangle, FiFlag, FiTrendingUp, FiMessageCircle,
  FiBell, FiUser, FiUsers, FiSettings, FiShield, FiBarChart2,
  FiList, FiBookOpen, FiHome, FiLogOut, FiActivity, FiClipboard,
  FiArchive,
} from 'react-icons/fi';

const SIDEBAR_CONFIG = {
  student: [
    { path: '/dashboard', icon: FiGrid, label: 'Dashboard' },
    { path: '/courses', icon: FiBook, label: 'My Courses' },
    { path: '/assignments', icon: FiFileText, label: 'Assignments' },
    { path: '/quizzes', icon: FiCheckSquare, label: 'Quizzes' },
    { path: '/attendance', icon: FiCalendar, label: 'Attendance' },
    { path: '/recovery', icon: FiTrendingUp, label: 'Recovery Path' },
    { path: '/resources', icon: FiBookOpen, label: 'Resources' },
    { path: '/notifications', icon: FiBell, label: 'Notifications', badge: true },
    { path: '/profile', icon: FiUser, label: 'Profile' },
  ],
  faculty: [
    { path: '/dashboard', icon: FiGrid, label: 'Dashboard' },
    { path: '/courses', icon: FiBook, label: 'Courses' },
    { path: '/mark-attendance', icon: FiCalendar, label: 'Mark Attendance' },
    { path: '/assignments', icon: FiFileText, label: 'Assignments' },
    { path: '/quizzes', icon: FiCheckSquare, label: 'Quizzes' },
    { path: '/at-risk', icon: FiAlertTriangle, label: 'At-Risk Students' },
    { path: '/reports', icon: FiFlag, label: 'Faculty Reports' },
    { path: '/recovery-monitor', icon: FiActivity, label: 'Recovery Monitor' },
    { path: '/notifications', icon: FiBell, label: 'Notifications', badge: true },
    { path: '/profile', icon: FiUser, label: 'Profile' },
  ],
  parent: [
    { path: '/dashboard', icon: FiGrid, label: 'Dashboard' },
    { path: '/academic-backlog', icon: FiList, label: 'Academic Backlog' },
    { path: '/faculty-reports', icon: FiFlag, label: 'Faculty Reports', badge: true },
    { path: '/attendance', icon: FiCalendar, label: 'Attendance' },
    { path: '/recovery-progress', icon: FiTrendingUp, label: 'Recovery Progress' },
    { path: '/notifications', icon: FiBell, label: 'Notifications', badge: true },
    { path: '/acknowledgement-history', icon: FiArchive, label: 'Acknowledgements' },
    { path: '/profile', icon: FiUser, label: 'Profile' },
  ],
  hod: [
    { path: '/dashboard', icon: FiGrid, label: 'Dashboard' },
    { path: '/faculty', icon: FiUsers, label: 'Faculty' },
    { path: '/classes', icon: FiBook, label: 'Classes' },
    { path: '/timetable', icon: FiCalendar, label: 'Timetable' },
    { path: '/at-risk', icon: FiAlertTriangle, label: 'At-Risk Students' },
    { path: '/analytics', icon: FiBarChart2, label: 'Analytics' },
    { path: '/notifications', icon: FiBell, label: 'Notifications', badge: true },
    { path: '/profile', icon: FiUser, label: 'Profile' },
  ],
  admin: [
    { path: '/dashboard', icon: FiGrid, label: 'Dashboard' },
    { path: '/users', icon: FiUsers, label: 'Users' },
    { path: '/departments', icon: FiHome, label: 'Departments' },
    { path: '/roles', icon: FiShield, label: 'Roles' },
    { path: '/analytics', icon: FiBarChart2, label: 'Analytics' },
    { path: '/risk-config', icon: FiSettings, label: 'Risk Config' },
    { path: '/audit-logs', icon: FiClipboard, label: 'Audit Logs' },
    { path: '/notifications', icon: FiBell, label: 'Notifications', badge: true },
    { path: '/profile', icon: FiUser, label: 'Profile' },
  ],
};

const ROLE_COLORS = {
  admin: '#7c3aed',
  hod: '#0ea5e9',
  faculty: '#16a34a',
  student: '#f97316',
  parent: '#ec4899',
};

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, unreadCount, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const items = SIDEBAR_CONFIG[user?.role] || [];
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99 }}
          onClick={onClose}
        />
      )}
      <aside className={`sidebar${mobileOpen ? ' mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.9"/>
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="sidebar-logo-text">Edu<span>Pulse</span></span>
        </div>

        {/* Role Badge */}
        <div style={{ padding: '8px 16px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '99px',
            background: ROLE_COLORS[user?.role] + '15',
            border: `1px solid ${ROLE_COLORS[user?.role]}30`,
            fontSize: '11px',
            fontWeight: 700,
            color: ROLE_COLORS[user?.role],
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: ROLE_COLORS[user?.role] }} />
            {user?.role}
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {items.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-item-icon">
                <item.icon size={16} />
              </span>
              {item.label}
              {item.badge && unreadCount > 0 && (
                <span className="sidebar-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
              )}
            </NavLink>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <button
              className="sidebar-item"
              style={{ width: '100%', color: 'var(--color-error)' }}
              onClick={() => setShowLogoutConfirm(true)}
            >
              <span className="sidebar-item-icon"><FiLogOut size={16} /></span>
              Log Out
            </button>
          </div>
        </nav>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.department?.name || user?.role}</div>
          </div>
        </div>

        {/* Logout Confirm */}
        {showLogoutConfirm && (
          <div style={{
            position: 'absolute',
            bottom: '80px',
            left: '12px',
            right: '12px',
            background: 'white',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 200,
          }}>
            <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
              Sign out of EduPulse?
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}
                onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
              <button className="btn btn-danger btn-sm" style={{ flex: 1 }}
                onClick={handleLogout}>Sign Out</button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
