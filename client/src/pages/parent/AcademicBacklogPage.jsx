import { DEMO_ASSIGNMENTS, DEMO_QUIZZES } from '../../data/mockData';

export default function AcademicBacklogPage() {
  const incomplete = DEMO_ASSIGNMENTS.filter(a => a.status !== 'submitted');
  const lowQuizzes = DEMO_QUIZZES.filter(q => q.attempt && q.attempt.percentage < 60);
  const missed = DEMO_ASSIGNMENTS.filter(a => a.status === 'overdue');

  const Section = ({ title, icon, items, emptyMsg }) => (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>{icon}</span>
          <div className="card-title">{title}</div>
        </div>
        <span className="badge badge-error">{items.length} items</span>
      </div>
      {items.length === 0 ? (
        <div className="empty-state"><div className="empty-state-text">✓ {emptyMsg}</div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item, i) => {
            const isQuiz = 'attempt' in item;
            const statusColor = item.status === 'overdue' ? '#ef4444' : item.status === 'incomplete' ? '#f59e0b' : '#f97316';
            return (
              <div key={item._id || i} style={{
                padding: '16px 20px',
                background: 'var(--color-bg-secondary)',
                borderRadius: '12px',
                border: `1px solid ${statusColor}30`,
                borderLeft: `4px solid ${statusColor}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      {isQuiz ? item.course?.name : item.course?.name}
                    </div>
                    {item.dueDate && (
                      <div style={{ fontSize: '12px', color: statusColor, fontWeight: 600, marginTop: '4px' }}>
                        Due: {item.dueDate}
                      </div>
                    )}
                    {isQuiz && item.attempt && (
                      <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 600, marginTop: '4px' }}>
                        Score: {item.attempt.percentage}% — Below passing threshold
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="badge" style={{
                      background: statusColor + '15',
                      color: statusColor,
                      border: `1px solid ${statusColor}30`
                    }}>
                      {isQuiz ? 'Low Performance' : item.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                  </div>
                </div>
                <div style={{ marginTop: '8px', padding: '8px 12px', background: 'rgba(255,255,255,0.7)', borderRadius: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  ℹ️ This record is view-only. Your ward must complete this to clear the backlog.
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-title">Academic Backlog</div>
        <div className="page-subtitle">Pending and incomplete academic activities for Arun Kumar</div>
      </div>

      {/* Summary banner */}
      <div style={{
        background: 'linear-gradient(135deg, #fef2f2, #fff7ed)',
        border: '1.5px solid #fecaca', borderRadius: '16px',
        padding: '20px 24px', marginBottom: '28px',
        display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#ef4444', marginBottom: '6px' }}>
            ⚠️ Academic Backlog Alert
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Your ward has pending work that needs to be completed. This may impact their academic performance and risk status.
            Please encourage them to complete the below activities.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { label: 'Incomplete', value: incomplete.length, color: '#f59e0b' },
            { label: 'Overdue', value: missed.length, color: '#ef4444' },
            { label: 'Low Score', value: lowQuizzes.length, color: '#f97316' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <Section
        title="Incomplete & Pending Assignments"
        icon="📝"
        items={incomplete}
        emptyMsg="No incomplete assignments"
      />

      <Section
        title="Low-Performing Quizzes"
        icon="❌"
        items={lowQuizzes}
        emptyMsg="No low-performing quizzes"
      />
    </div>
  );
}
