import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBell, FiMenu, FiX, FiCheck, FiAlertTriangle, FiCalendar, FiFlag, FiTrendingUp, FiInfo } from 'react-icons/fi';
import { format, formatDistanceToNow } from 'date-fns';

const NOTIF_ICONS = {
  faculty_report: { icon: FiFlag, color: '#f97316', bg: '#fff7ed' },
  low_performance: { icon: FiAlertTriangle, color: '#ef4444', bg: '#fef2f2' },
  incomplete_assignment: { icon: FiInfo, color: '#3b82f6', bg: '#eff6ff' },
  attendance_alert: { icon: FiCalendar, color: '#f59e0b', bg: '#fffbeb' },
  recovery_progress: { icon: FiTrendingUp, color: '#16a34a', bg: '#dcfce7' },
  risk_flag: { icon: FiAlertTriangle, color: '#ef4444', bg: '#fef2f2' },
  acknowledgement: { icon: FiCheck, color: '#16a34a', bg: '#dcfce7' },
  general: { icon: FiInfo, color: '#3b82f6', bg: '#eff6ff' },
};

function NotifPanel({ onClose }) {
  const { notifications, markNotificationRead, markAllRead, unreadCount } = useAuth();
  const navigate = useNavigate();

  const handleNotifClick = (notif) => {
    markNotificationRead(notif._id);
    if (notif.type === 'faculty_report' || notif.relatedReport) {
      navigate('/faculty-reports');
    } else if (notif.type === 'attendance_alert') {
      navigate('/attendance');
    } else if (notif.type === 'recovery_progress') {
      navigate('/recovery-progress');
    } else {
      navigate('/notifications');
    }
    onClose();
  };

  return (
    <div style={{
      position: 'absolute',
      top: '100%',
      right: 0,
      width: '380px',
      background: 'white',
      border: '1px solid var(--color-border)',
      borderRadius: '16px',
      boxShadow: 'var(--shadow-xl)',
      zIndex: 1000,
      overflow: 'hidden',
      animation: 'slideUp 0.2s ease',
      marginTop: '8px',
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700 }}>Notifications</div>
          {unreadCount > 0 && (
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              {unreadCount} unread
            </div>
          )}
        </div>
        <button
          style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none' }}
          onClick={markAllRead}
        >
          Mark all read
        </button>
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <FiBell size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <div style={{ fontSize: '14px' }}>No notifications yet</div>
          </div>
        ) : (
          notifications.slice(0, 8).map(notif => {
            const cfg = NOTIF_ICONS[notif.type] || NOTIF_ICONS.general;
            return (
              <div
                key={notif._id}
                className={`notification-item${!notif.isRead ? ' unread' : ''}`}
                onClick={() => handleNotifClick(notif)}
              >
                <div className="notification-icon" style={{ background: cfg.bg }}>
                  <cfg.icon size={16} color={cfg.color} />
                </div>
                <div className="notification-content">
                  <div className="notification-title">{notif.title}</div>
                  <div className="notification-message">{notif.message}</div>
                  <div className="notification-time">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </div>
                </div>
                {!notif.isRead && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: '6px' }} />
                )}
              </div>
            );
          })
        )}
      </div>

      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
        <button
          style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none' }}
          onClick={() => { navigate('/notifications'); onClose(); }}
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}

export default function TopHeader({ title, subtitle, onMenuToggle }) {
  const { user, unreadCount } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="top-header">
      <div className="top-header-left">
        <button
          className="header-icon-btn"
          style={{ display: 'flex' }}
          onClick={onMenuToggle}
          id="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <FiMenu size={18} />
        </button>
        <div>
          <div className="top-header-title">
            {title || `${greeting()}, ${user?.name?.split(' ')[0]}!`}
          </div>
          {subtitle && <div className="top-header-subtitle">{subtitle}</div>}
        </div>
      </div>

      <div className="top-header-right" style={{ position: 'relative' }}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            className="header-icon-btn"
            onClick={() => setShowNotifs(v => !v)}
            id="notification-bell"
            aria-label="Notifications"
          >
            <FiBell size={18} />
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>
          {showNotifs && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                onClick={() => setShowNotifs(false)}
              />
              <div style={{ position: 'relative', zIndex: 1000 }}>
                <NotifPanel onClose={() => setShowNotifs(false)} />
              </div>
            </>
          )}
        </div>

        {/* Avatar */}
        <div
          className="avatar avatar-sm"
          style={{ cursor: 'pointer', fontSize: '12px' }}
          title={user?.name}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
