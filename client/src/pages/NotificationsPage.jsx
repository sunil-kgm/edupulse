import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import {
  FiFlag, FiAlertTriangle, FiInfo, FiCalendar, FiTrendingUp, FiCheck, FiBell
} from 'react-icons/fi';

const NOTIF_CONFIG = {
  faculty_report: { icon: FiFlag, color: '#f97316', bg: '#fff7ed', label: 'Faculty Report' },
  low_performance: { icon: FiAlertTriangle, color: '#ef4444', bg: '#fef2f2', label: 'Performance Alert' },
  incomplete_assignment: { icon: FiInfo, color: '#3b82f6', bg: '#eff6ff', label: 'Assignment' },
  attendance_alert: { icon: FiCalendar, color: '#f59e0b', bg: '#fffbeb', label: 'Attendance' },
  recovery_progress: { icon: FiTrendingUp, color: '#16a34a', bg: '#dcfce7', label: 'Recovery' },
  risk_flag: { icon: FiAlertTriangle, color: '#ef4444', bg: '#fef2f2', label: 'Risk Alert' },
  acknowledgement: { icon: FiCheck, color: '#16a34a', bg: '#dcfce7', label: 'Acknowledged' },
  general: { icon: FiInfo, color: '#3b82f6', bg: '#eff6ff', label: 'General' },
};

const ACTION_MAP = {
  faculty_report: '/faculty-reports',
  low_performance: '/student-overview',
  incomplete_assignment: '/academic-backlog',
  attendance_alert: '/attendance',
  recovery_progress: '/recovery-progress',
  risk_flag: '/recovery',
  acknowledgement: '/reports',
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllRead, unreadCount } = useAuth();
  const navigate = useNavigate();

  const handleClick = (notif) => {
    markNotificationRead(notif._id);
    const path = ACTION_MAP[notif.type];
    if (path) navigate(path);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">Notifications</div>
            <div className="page-subtitle">{unreadCount} unread notifications</div>
          </div>
          {unreadCount > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={markAllRead}>
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }}>🔔</div>
          <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>All caught up!</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>No notifications yet.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map(notif => {
            const cfg = NOTIF_CONFIG[notif.type] || NOTIF_CONFIG.general;
            return (
              <div
                key={notif._id}
                onClick={() => handleClick(notif)}
                id={`notif-${notif._id}`}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  padding: '16px 20px', borderRadius: '14px', cursor: 'pointer',
                  background: notif.isRead ? 'white' : '#f0fdf4',
                  border: `1.5px solid ${notif.isRead ? 'var(--color-border)' : 'var(--color-primary)30'}`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                  background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <cfg.icon size={18} color={cfg.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div>
                      <div style={{ fontWeight: notif.isRead ? 600 : 700, fontSize: '14px', marginBottom: '3px' }}>
                        {notif.title}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                        {notif.message}
                      </div>
                    </div>
                    {!notif.isRead && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: '6px' }} />
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                    <span style={{ fontSize: '11px', background: cfg.bg, color: cfg.color, padding: '2px 8px', borderRadius: '99px', fontWeight: 600 }}>
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
