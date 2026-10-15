import { DEMO_RECOVERY_PATH } from '../../data/mockData';
import { FiCheck, FiClock } from 'react-icons/fi';

export default function ParentRecoveryPage() {
  const recovery = DEMO_RECOVERY_PATH;
  const completed = recovery.milestones.filter(m => m.status === 'completed').length;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '760px' }}>
      <div className="page-header">
        <div className="page-title">Recovery Progress</div>
        <div className="page-subtitle">Arun Kumar's academic recovery journey</div>
      </div>

      {/* Progress Header */}
      <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #bbf7d0', borderRadius: '18px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '18px' }}>Recovery In Progress</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{completed} of {recovery.milestones.length} milestones completed</div>
          </div>
          <div style={{ fontSize: '40px', fontWeight: 800, color: 'var(--color-primary)', fontFamily: "'Space Grotesk',sans-serif" }}>
            {recovery.progressPercent}%
          </div>
        </div>
        <div className="progress-bar-container" style={{ height: '14px' }}>
          <div className="progress-bar-fill" style={{ width: `${recovery.progressPercent}%`, height: '100%' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
          <span>Started</span>
          <span>Recovery Complete</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: '24px' }}>Milestone Timeline</div>
        <div style={{ position: 'relative', paddingLeft: '36px' }}>
          <div style={{ position: 'absolute', left: '12px', top: '16px', bottom: '16px', width: '2px', background: 'linear-gradient(to bottom, var(--color-primary) 33%, var(--color-border) 33%)' }} />

          {recovery.milestones.map((m, i) => (
            <div key={m._id} style={{ position: 'relative', paddingBottom: i < recovery.milestones.length - 1 ? '24px' : '0' }}>
              <div style={{
                position: 'absolute', left: '-36px', top: '6px',
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: m.status === 'completed' ? 'var(--color-primary)' : m.status === 'current' ? 'white' : 'var(--color-bg-secondary)',
                border: `2.5px solid ${m.status !== 'pending' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                boxShadow: m.status === 'current' ? '0 0 0 4px var(--color-primary-lighter)' : 'none',
              }}>
                {m.status === 'completed' && <FiCheck size={11} color="white" />}
                {m.status === 'current' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)' }} />}
              </div>

              <div style={{
                padding: '14px 18px', borderRadius: '12px',
                background: m.status === 'completed' ? '#f0fdf4' : m.status === 'current' ? 'white' : 'var(--color-bg-secondary)',
                border: `1.5px solid ${m.status === 'completed' ? '#bbf7d0' : m.status === 'current' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{m.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{m.description}</div>
                    {m.completedAt && (
                      <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '5px' }}>✓ Completed {m.completedAt}</div>
                    )}
                    {m.dueDate && m.status !== 'completed' && (
                      <div style={{ fontSize: '11px', color: m.status === 'current' ? 'var(--color-primary)' : 'var(--color-text-muted)', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiClock size={10} /> Due: {m.dueDate}
                      </div>
                    )}
                  </div>
                  <span className={`badge ${m.status === 'completed' ? 'badge-success' : m.status === 'current' ? 'badge-info' : 'badge-neutral'}`}>
                    {m.status === 'completed' ? '✓ Done' : m.status === 'current' ? '● Active' : '○ Pending'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
