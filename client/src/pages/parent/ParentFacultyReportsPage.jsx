import { useState } from 'react';
import { DEMO_FACULTY_REPORTS } from '../../data/mockData';
import { FiX, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useApi, useMutation } from '../../hooks/useApi';
import { getReports, acknowledgeReport } from '../../services/api';

function AcknowledgeModal({ report, onClose, onAcknowledge }) {
  const [step, setStep] = useState('read'); // 'read' | 'done'
  const [timestamp] = useState(new Date());
  const { mutate: doAck, loading } = useMutation(() => acknowledgeReport(report._id));
  const { user } = useAuth();

  const handleAcknowledge = async () => {
    const result = await doAck();
    // Whether API succeeds or fails (demo mode), mark locally
    setStep('done');
    setTimeout(() => {
      onAcknowledge(report._id, timestamp);
      onClose();
    }, 2500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container animate-slide-up" style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Faculty Academic Report</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>Please review this academic report carefully.</div>
          </div>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>

        {step === 'done' ? (
          <div className="ack-success">
            <div className="ack-success-icon">✓</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#16a34a', marginBottom: '8px' }}>Report Acknowledged</div>
            <div style={{ color: 'var(--color-text-secondary)', marginBottom: '20px', fontSize: '14px' }}>
              Your acknowledgement has been recorded. The faculty will be notified.
            </div>
            <div style={{ background: 'var(--color-success-bg)', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Acknowledged by:</span>
                  <span style={{ fontWeight: 700 }}>{user?.name || 'Parent'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Date:</span>
                  <span style={{ fontWeight: 700 }}>{timestamp.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Time:</span>
                  <span style={{ fontWeight: 700 }}>{timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '16px', padding: '12px', background: '#f8f9fb', borderRadius: '10px', fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              Note: Acknowledgement means "I have reviewed this report." It does not mean agreement with the report.
            </div>
          </div>
        ) : (
          <>
            <div className="modal-body">
              <div style={{ background: 'var(--color-bg-secondary)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {[
                    { label: 'Subject', value: report.course?.name },
                    { label: 'Reported By', value: report.faculty?.name },
                    { label: 'Concern', value: report.concernType?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) },
                    { label: 'Date', value: report.createdAt ? (typeof report.createdAt === 'string' && report.createdAt.length <= 12 ? report.createdAt : new Date(report.createdAt).toLocaleDateString('en-IN')) : '—' },
                    { label: 'Severity', value: report.severity?.charAt(0).toUpperCase() + report.severity?.slice(1) },
                    { label: 'Student', value: report.student?.name },
                  ].map(f => (
                    <div key={f.label}>
                      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)', marginBottom: '3px' }}>{f.label}</div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{f.value || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Description</div>
                <div style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-secondary)', padding: '14px', background: 'white', border: '1px solid var(--color-border)', borderRadius: '10px' }}>
                  {report.description}
                </div>
              </div>

              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#92400e' }}>
                <strong>⚠️ Important:</strong> Clicking "Acknowledge" means you have <em>read and reviewed</em> this report. It does not mean you agree with it.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
              <button
                className="btn btn-primary"
                onClick={handleAcknowledge}
                disabled={loading}
                id={`acknowledge-report-${report._id}`}
              >
                {loading ? <><div className="loading-spinner" style={{ width: 14, height: 14 }} /> Saving...</> : <><FiCheck size={14} /> Acknowledge Report</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ParentFacultyReportsPage() {
  const { user } = useAuth();
  const [viewing, setViewing] = useState(null);

  const { data: reports, setData: setReports, loading, refetch, isLive } = useApi(
    getReports,
    DEMO_FACULTY_REPORTS
  );

  const handleAcknowledge = (reportId, timestamp) => {
    setReports(prev => (prev || []).map(r =>
      r._id === reportId ? { ...r, parentAcknowledged: true, acknowledgedAt: timestamp.toISOString() } : r
    ));
  };

  const displayReports = reports || [];
  const pendingCount = displayReports.filter(r => !r.parentAcknowledged).length;

  const severityConfig = {
    high: { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', emoji: '🔴' },
    medium: { color: '#f97316', bg: '#fff7ed', border: '#fed7aa', emoji: '🟠' },
    low: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', emoji: '🟡' },
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">Faculty Reports</div>
            <div className="page-subtitle">
              Academic concerns reported by faculty ·{' '}
              <span style={{ color: '#f97316', fontWeight: 700 }}>
                {pendingCount} require acknowledgement
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isLive && <span className="badge badge-success" style={{ fontSize: '11px' }}>● Live</span>}
            <button className="btn btn-secondary btn-sm" onClick={refetch} disabled={loading} title="Refresh">
              <FiRefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {displayReports.map(r => {
          const sc = severityConfig[r.severity] || severityConfig.low;
          const dateStr = r.createdAt
            ? (typeof r.createdAt === 'string' && r.createdAt.length <= 12
              ? r.createdAt
              : new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }))
            : '—';
          return (
            <div key={r._id} style={{
              background: 'white', border: '1.5px solid var(--color-border)',
              borderRadius: '18px', overflow: 'hidden',
              borderLeft: `5px solid ${sc.color}`, transition: 'box-shadow 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <span className="badge" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                        {sc.emoji} {r.severity?.toUpperCase()} SEVERITY
                      </span>
                      <span className="badge badge-neutral">
                        {r.concernType?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '4px' }}>{r.course?.name} Academic Report</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                      Reported by <strong>{r.faculty?.name}</strong> · {dateStr}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
                      {r.description}
                    </div>
                  </div>

                  {/* Acknowledgement Status Panel */}
                  <div style={{ minWidth: '200px' }}>
                    <div style={{
                      background: r.parentAcknowledged ? '#f0fdf4' : '#fff7ed',
                      border: `1.5px solid ${r.parentAcknowledged ? '#bbf7d0' : '#fed7aa'}`,
                      borderRadius: '14px', padding: '16px', textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                        Parent Status
                      </div>
                      {r.parentAcknowledged ? (
                        <div>
                          <div style={{ fontSize: '28px', marginBottom: '4px' }}>✅</div>
                          <div style={{ fontWeight: 700, color: '#16a34a', fontSize: '14px' }}>Acknowledged</div>
                          {r.acknowledgedAt && (
                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                              {new Date(r.acknowledgedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '28px', marginBottom: '4px' }}>⚠️</div>
                          <div style={{ fontWeight: 700, color: '#f97316', fontSize: '14px' }}>Not Acknowledged</div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Action required</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setViewing(r)}>
                    View Full Report
                  </button>
                  {!r.parentAcknowledged && (
                    <button className="btn btn-primary btn-sm" onClick={() => setViewing(r)} id={`open-ack-${r._id}`}>
                      <FiCheck size={12} /> Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {displayReports.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px', opacity: 0.4 }}>📋</div>
            <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>No reports yet</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Faculty reports for your ward will appear here.</div>
          </div>
        )}
      </div>

      {viewing && (
        <AcknowledgeModal
          report={viewing}
          onClose={() => setViewing(null)}
          onAcknowledge={handleAcknowledge}
        />
      )}
    </div>
  );
}
