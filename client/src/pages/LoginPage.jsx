import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@edupulse.edu', password: 'admin123', color: '#7c3aed', icon: '🛡️' },
  { role: 'HoD', email: 'hod@edupulse.edu', password: 'hod123', color: '#0ea5e9', icon: '🎓' },
  { role: 'Faculty', email: 'faculty@edupulse.edu', password: 'faculty123', color: '#16a34a', icon: '👨‍🏫' },
  { role: 'Student', email: 'student@edupulse.edu', password: 'student123', color: '#f97316', icon: '📚' },
  { role: 'Parent', email: 'parent@edupulse.edu', password: 'parent123', color: '#ec4899', icon: '👨‍👩‍👧' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Invalid credentials. Try a demo account below.');
      }
    } catch {
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  const quickLogin = async (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
    setLoading(true);
    const result = await login(acc.email, acc.password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 50%, #f5f3ff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div className="login-form-container animate-slide-up" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="login-logo" style={{ justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #16a34a, #22c55e)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white"/>
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="login-logo-text">Edu<span style={{ color: 'var(--color-primary)' }}>Pulse</span></span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <div style={{ position: 'relative' }}>
              <FiMail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                id="login-email"
                type="email"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="your@email.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                onClick={() => setShowPass(v => !v)}
              >
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: 'var(--color-error-bg)', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: 'var(--color-error)', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: '46px', fontSize: '15px' }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <div className="loading-spinner" style={{ width: 16, height: 16 }} />
                Signing in...
              </span>
            ) : <>Sign In <FiArrowRight size={16} /></>}
          </button>
        </form>

        <div className="demo-roles">
          <div className="demo-roles-title">Quick Demo Access</div>
          <div className="demo-role-list">
            {DEMO_ACCOUNTS.map(acc => (
              <div key={acc.role} className="demo-role-item" id={`demo-login-${acc.role.toLowerCase()}`} onClick={() => quickLogin(acc)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{acc.icon}</span>
                  <div>
                    <div className="demo-role-name" style={{ color: acc.color }}>{acc.role}</div>
                    <div className="demo-role-email">{acc.email}</div>
                  </div>
                </div>
                <FiArrowRight size={14} style={{ color: 'var(--color-text-muted)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
