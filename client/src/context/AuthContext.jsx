import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEMO_USERS, DEMO_NOTIFICATIONS } from '../data/mockData';
import { getNotifications, markNotifRead as apiMarkRead, markAllNotifsRead as apiMarkAll } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // ─── Fetch notifications from backend (or fall back to mock) ───
  const fetchNotifications = useCallback(async (u, tok) => {
    if (!tok || tok.startsWith('demo_token_')) {
      // Use mock notifications for demo mode
      const role = u?.role;
      setNotifications(DEMO_NOTIFICATIONS[role] || []);
      return;
    }
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch {
      // Backend unavailable – fall back to demo notifications
      const role = u?.role;
      setNotifications(DEMO_NOTIFICATIONS[role] || []);
    }
  }, []);

  // ─── Restore session on mount ──────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('edupulse_user');
    const storedToken = localStorage.getItem('edupulse_token');
    if (stored && storedToken) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
      setToken(storedToken);
      fetchNotifications(parsedUser, storedToken);
    }
    setLoading(false);
  }, [fetchNotifications]);

  // ─── Login ──────────────────────────────────────────────────────
  const login = async (email, password) => {
    // 1. Try demo users first (works offline)
    const demoUser = Object.values(DEMO_USERS).find(
      (u) => u.email === email && u.password === password
    );

    if (demoUser) {
      const { password: _, ...userData } = demoUser;
      const fakeToken = `demo_token_${demoUser.role}_${Date.now()}`;
      setUser(userData);
      setToken(fakeToken);
      localStorage.setItem('edupulse_user', JSON.stringify(userData));
      localStorage.setItem('edupulse_token', fakeToken);
      await fetchNotifications(userData, fakeToken);
      return { success: true, user: userData };
    }

    // 2. Try real backend
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('edupulse_user', JSON.stringify(data.user));
        localStorage.setItem('edupulse_token', data.token);
        await fetchNotifications(data.user, data.token);
        return { success: true, user: data.user };
      }
      const errData = await res.json().catch(() => ({}));
      return { success: false, message: errData.message || 'Invalid credentials' };
    } catch {
      // Backend unreachable
    }

    return { success: false, message: 'Invalid credentials' };
  };

  // ─── Logout ─────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
    setNotifications([]);
    localStorage.removeItem('edupulse_user');
    localStorage.removeItem('edupulse_token');
  };

  // ─── Notification helpers ────────────────────────────────────────
  const markNotificationRead = async (id) => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    // Sync to backend if real session
    if (token && !token.startsWith('demo_token_')) {
      try { await apiMarkRead(id); } catch { /* ignore */ }
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    if (token && !token.startsWith('demo_token_')) {
      try { await apiMarkAll(); } catch { /* ignore */ }
    }
  };

  const refreshNotifications = () => fetchNotifications(user, token);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllRead,
        setNotifications,
        refreshNotifications,
        isDemo: token?.startsWith('demo_token_') ?? true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
