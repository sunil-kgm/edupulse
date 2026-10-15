import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiZap, FiTrendingUp, FiUsers, FiShield, FiBarChart2, FiMessageSquare } from 'react-icons/fi';

function DashboardMockup() {
  return (
    <div className="dashboard-preview">
      {/* Browser bar */}
      <div className="preview-header">
        <div className="preview-dot" style={{ background: '#ef4444' }} />
        <div className="preview-dot" style={{ background: '#f59e0b' }} />
        <div className="preview-dot" style={{ background: '#22c55e' }} />
        <span style={{ marginLeft: '8px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
          edupulse.edu/student/dashboard
        </span>
      </div>

      {/* Stats */}
      <div className="preview-stats">
        <div className="preview-stat-card">
          <div className="preview-stat-value" style={{ color: 'var(--color-primary)' }}>78%</div>
          <div className="preview-stat-label">Overall Performance</div>
        </div>
        <div className="preview-stat-card">
          <div className="preview-stat-value" style={{ color: '#f97316' }}>68%</div>
          <div className="preview-stat-label">Attendance</div>
        </div>
        <div className="preview-stat-card">
          <div className="preview-stat-value" style={{ color: '#3b82f6' }}>8/10</div>
          <div className="preview-stat-label">Assignments</div>
        </div>
        <div className="preview-stat-card">
          <div className="preview-stat-value" style={{ color: '#ef4444' }}>High</div>
          <div className="preview-stat-label">Risk Status</div>
        </div>
      </div>

      {/* Risk Alert */}
      <div className="preview-risk">
        <div style={{ width: 28, height: 28, borderRadius: '8px', background: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>⚠️</div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444' }}>High Risk Detected</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>3 factors identified</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#ef4444', background: '#fef2f2', padding: '3px 8px', borderRadius: '99px', border: '1px solid #fecaca' }}>HIGH</div>
        </div>
      </div>

      {/* Progress Bars */}
      <div style={{ background: 'var(--color-bg-secondary)', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '12px', color: 'var(--color-text-primary)' }}>
          Recovery Path — 33%
        </div>
        {[
          { label: 'Risk Identified', pct: 100, color: 'var(--color-primary)', done: true },
          { label: 'Review Material', pct: 100, color: 'var(--color-primary)', done: true },
          { label: 'Practice Quiz', pct: 45, color: '#f97316', done: false },
          { label: 'Submit Assignment', pct: 0, color: '#e5e8ef', done: false },
        ].map((item) => (
          <div key={item.label} className="preview-progress-row">
            <div className="preview-progress-label">
              <span style={{ color: item.done ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                {item.done ? '✓ ' : '○ '}{item.label}
              </span>
              <span style={{ fontWeight: 700 }}>{item.pct}%</span>
            </div>
            <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '99px', transition: 'width 1s ease' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: '📊',
    title: 'Academic Monitoring',
    desc: 'Track attendance, assignments, quizzes and academic performance in real-time across all courses.',
  },
  {
    icon: '⚠️',
    title: 'Risk Detection',
    desc: 'Automatically identify students crossing configured academic thresholds using transparent rule-based logic.',
  },
  {
    icon: '🛤️',
    title: 'Recovery Paths',
    desc: 'Structured milestone-based recovery plans that guide students back to academic success step by step.',
  },
  {
    icon: '📝',
    title: 'Faculty Reports',
    desc: 'Faculty can flag incomplete work, low performance and attendance concerns with severity levels.',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Parent Communication',
    desc: 'Parents receive academic alerts and can acknowledge faculty reports, creating an accountability loop.',
  },
  {
    icon: '📈',
    title: 'Progress Analytics',
    desc: 'Track academic improvement, recovery completion and performance trends with visual dashboards.',
  },
];

const WORKFLOW = [
  { step: '01', title: 'Detect', desc: 'Identify attendance, assignment and performance concerns automatically.' },
  { step: '02', title: 'Understand', desc: 'Understand why the student is struggling through faculty observations.' },
  { step: '03', title: 'Support', desc: 'Provide relevant learning resources and faculty intervention.' },
  { step: '04', title: 'Recover', desc: 'Create a milestone-based recovery plan tailored to each student.' },
  { step: '05', title: 'Measure', desc: 'Track improvement, recovery progress and update risk status.' },
];

export default function LandingPage() {
  return (
    <div style={{ background: 'white' }}>
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #16a34a, #22c55e)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white"/>
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px' }}>
              Edu<span style={{ color: 'var(--color-primary)' }}>Pulse</span>
            </span>
          </div>

          <div className="landing-nav-links">
            {['Home', 'Features', 'How It Works', 'Roles', 'About'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} className="landing-nav-link">{link}</a>
            ))}
          </div>

          <div className="landing-nav-actions">
            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
            <Link to="/login" className="btn btn-primary btn-sm">Get Started <FiArrowRight size={14} /></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero" id="home">
        <div className="landing-hero-inner">
          <div className="landing-hero-content">
            <div className="landing-hero-tag">
              <FiZap size={12} />
              Academic Risk Management Platform
            </div>
            <h1 className="landing-hero-title">
              Detect Problems.<br />
              <span>Support Students.</span><br />
              Measure Recovery.
            </h1>
            <p className="landing-hero-subtitle">
              EduPulse connects academic monitoring, early risk detection, personalized recovery and parent-faculty communication in one platform.
            </p>
            <div className="landing-hero-actions">
              <Link to="/login" className="btn btn-primary btn-lg">
                Explore Platform <FiArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Login to Dashboard
              </Link>
            </div>

            <div className="landing-hero-stats">
              {[
                { value: '5', label: 'User Roles' },
                { value: '360°', label: 'Academic View' },
                { value: '100%', label: 'Transparent' },
              ].map(s => (
                <div key={s.label}>
                  <div className="hero-stat-value">{s.value}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <DashboardMockup />
        </div>
      </section>

      {/* Workflow */}
      <section className="workflow-section" id="how-it-works">
        <div className="workflow-inner">
          <div style={{ textAlign: 'center', marginBottom: '0' }}>
            <div className="section-label">Core Workflow</div>
            <h2 className="section-title">How EduPulse Works</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              A five-stage system that creates a complete academic support loop between students, faculty and parents.
            </p>
          </div>

          <div className="workflow-steps">
            {WORKFLOW.map((w, i) => (
              <div key={w.step} className="workflow-step" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="workflow-step-number">{w.step}</div>
                <div className="workflow-step-title">{w.title}</div>
                <p className="workflow-step-desc">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features">
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--space-4)' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="section-label">Platform Features</div>
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Comprehensive academic monitoring, communication, and recovery tools in one platform.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section style={{ padding: 'var(--space-16) var(--space-8)', background: 'white' }} id="roles">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <div className="section-label">Platform Roles</div>
            <h2 className="section-title">Built for Everyone</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-4)' }}>
            {[
              { role: 'Admin', icon: '🛡️', desc: 'Manage institution, users, departments and system settings', color: '#7c3aed' },
              { role: 'HoD', icon: '🎓', desc: 'Department overview, analytics, faculty management and class scheduling', color: '#0ea5e9' },
              { role: 'Faculty', icon: '👨‍🏫', desc: 'Monitor students, submit reports, track recovery and manage courses', color: '#16a34a' },
              { role: 'Student', icon: '📚', desc: 'View performance, follow recovery path and submit assignments', color: '#f97316' },
              { role: 'Parent', icon: '👨‍👩‍👧', desc: 'Receive alerts, view backlog, review reports and acknowledge concerns', color: '#ec4899' },
            ].map(r => (
              <div key={r.role} style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: 'var(--space-5)',
                textAlign: 'center',
                transition: 'all 0.2s',
                cursor: 'default',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{r.icon}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: r.color }}>{r.role}</div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: 'var(--space-16) var(--space-8)',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1px', marginBottom: '16px' }}>
            Ready to transform academic support?
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
            EduPulse creates a communication and recovery loop between students, faculty and parents.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg">
            Get Started Today <FiArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'var(--color-text-primary)',
        color: 'rgba(255,255,255,0.6)',
        padding: 'var(--space-8) var(--space-8)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #16a34a, #22c55e)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white"/>
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ color: 'white', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '18px' }}>EduPulse</span>
        </div>
        <p style={{ fontSize: '13px' }}>
          Student Learning & Academic Support Platform — Detect · Understand · Support · Recover · Measure
        </p>
        <p style={{ fontSize: '12px', marginTop: '8px', opacity: 0.5 }}>© 2026 EduPulse. College Final Year Project.</p>
      </footer>
    </div>
  );
}
