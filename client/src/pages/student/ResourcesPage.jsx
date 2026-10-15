import { DEMO_RESOURCES } from '../../data/mockData';
import { FiStar, FiExternalLink } from 'react-icons/fi';

const TYPE_CONFIG = {
  video: { icon: '🎬', color: '#ef4444', bg: '#fef2f2', label: 'Video' },
  pdf: { icon: '📄', color: '#f97316', bg: '#fff7ed', label: 'PDF' },
  article: { icon: '📖', color: '#3b82f6', bg: '#eff6ff', label: 'Article' },
  practice: { icon: '✏️', color: '#16a34a', bg: '#dcfce7', label: 'Practice' },
  quiz_set: { icon: '📝', color: '#7c3aed', bg: '#f3e8ff', label: 'Quiz Set' },
};

export default function ResourcesPage() {
  const resources = DEMO_RESOURCES;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-title">Learning Resources</div>
        <div className="page-subtitle">Curated resources based on your weak areas and courses</div>
      </div>

      <div className="grid-3">
        {resources.map(r => {
          const tc = TYPE_CONFIG[r.type] || { icon: '📚', color: '#3b82f6', bg: '#eff6ff', label: r.type };
          return (
            <div key={r._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ width: 48, height: 48, borderRadius: '12px', background: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                  {tc.icon}
                </div>
                <span className="badge" style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.color}30` }}>
                  {tc.label}
                </span>
              </div>

              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{r.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '6px' }}>
                  {r.course?.name} · {r.course?.code}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{r.description}</div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {r.tags.map(t => (
                  <span key={t} style={{ fontSize: '11px', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '99px', padding: '2px 8px', color: 'var(--color-text-muted)' }}>
                    #{t}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-border-light)', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {[1,2,3,4,5].map(s => (
                    <FiStar key={s} size={13} fill={s <= Math.round(r.rating) ? '#f59e0b' : 'none'} color={s <= Math.round(r.rating) ? '#f59e0b' : 'var(--color-border)'} />
                  ))}
                  <span style={{ fontSize: '12px', fontWeight: 700, marginLeft: '4px', color: '#f59e0b' }}>{r.rating}</span>
                </div>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                  Open <FiExternalLink size={12} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
