import { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApi, useMutation } from '../../hooks/useApi';
import { getStudentRecovery, updateMilestone, getStudentRiskFlags } from '../../services/api';
import { DEMO_RECOVERY_PATH, DEMO_RISK_FLAG } from '../../data/mockData';
import { FiCheck, FiClock, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';

export default function RecoveryPage() {
  const { user, isDemo } = useAuth();

  const { data: recovery, setData: setRecovery, loading, refetch, isLive } = useApi(
    () => getStudentRecovery(user?._id),
    DEMO_RECOVERY_PATH,
    [user?._id]
  );

  const { data: riskData } = useApi(
    () => getStudentRiskFlags(user?._id),
    [DEMO_RISK_FLAG],
    [user?._id]
  );

  const { mutate: doUpdateMilestone, loading: saving } = useMutation(
    (pathId, milestoneId, status) => updateMilestone(pathId, milestoneId, status)
  );

  const path = recovery || DEMO_RECOVERY_PATH;
  const risk = Array.isArray(riskData) ? riskData[0] : riskData || DEMO_RISK_FLAG;

  const completedCount = (path.milestones || []).filter(m => m.status === 'completed').length;
  const total = (path.milestones || []).length;

  // Advance current milestone — calls real API if live, else local only
  const advanceMilestone = useCallback(async () => {
    const milestones = (path.milestones || []).map(m => ({ ...m }));
    const currentIdx = milestones.findIndex(m => m.status === 'current');
    if (currentIdx === -1) return;

    const currentMilestone = milestones[currentIdx];

    if (isLive && path._id && currentMilestone._id) {
      const result = await doUpdateMilestone(path._id, currentMilestone._id, 'completed');
      if (result.success) {
        setRecovery(result.data);
        return;
      }
    }

    // Optimistic local update (demo mode or API failure)
    milestones[currentIdx].status = 'completed';
    milestones[currentIdx].completedAt = new Date().toISOString().split('T')[0];
    if (currentIdx + 1 < milestones.length) {
      milestones[currentIdx + 1].status = 'current';
    }
    const done = milestones.filter(m => m.status === 'completed').length;
    setRecovery(prev => ({ ...prev, milestones, progressPercent: Math.round((done / milestones.length) * 100) }));
  }, [path, isLive, doUpdateMilestone, setRecovery]);

  const statusIcon = (status) => {
    if (status === 'completed') return <FiCheck size={12} color="white" />;
    if (status === 'current') return <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)' }} />;
    return null;
  };

  const dotStyle = (status) => ({
    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: status === 'completed' ? 'var(--color-primary)' : status === 'current' ? 'white' : 'var(--color-bg-secondary)',
    border: `2.5px solid ${status === 'completed' ? 'var(--color-primary)' : status === 'current' ? 'var(--color-primary)' : 'var(--color-border)'}`,
    boxShadow: status === 'current' ? '0 0 0 5px var(--color-primary-lighter)' : 'none',
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">Your Recovery Journey</div>
            <div className="page-subtitle">Follow these milestones to get back on track</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isLive && <span className="badge badge-success" style={{ fontSize: '11px' }}>● Live</span>}
            <button className="btn btn-secondary btn-sm" onClick={refetch} disabled={loading} title="Refresh">
              <FiRefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Risk Context */}
      <div style={{
        background: 'linear-gradient(135deg, #fff5f5, #fef2f2)',
        border: '1.5px solid #fecaca', borderRadius: '16px',
        padding: '20px 24px', marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#ef4444', marginBottom: '6px' }}>
            ⚠️ {risk?.level ? risk.level.charAt(0).toUpperCase() + risk.level.slice(1) : 'High'} Risk — Recovery in Progress
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {(risk?.reasons || []).map(r => (
              <span key={r} style={{ fontSize: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '99px', padding: '3px 10px', color: '#ef4444', fontWeight: 600 }}>
                {r}
              </span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
            {path.progressPercent}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontWeight: 700 }}>Overall Progress</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>
            {completedCount} / {total} milestones
          </div>
        </div>
        <div className="progress-bar-container" style={{ height: '12px' }}>
          <div className="progress-bar-fill" style={{ width: `${path.progressPercent}%`, height: '100%' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
          <span>Started</span>
          <span>Recovery Complete</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: '24px' }}>
          <FiTrendingUp size={16} style={{ marginRight: '8px', color: 'var(--color-primary)' }} />
          Milestone Tracker
        </div>

        <div style={{ position: 'relative', paddingLeft: '36px' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: '12px', top: '16px',
            bottom: '16px', width: '2px',
            background: `linear-gradient(to bottom, var(--color-primary) ${path.progressPercent}%, var(--color-border) ${path.progressPercent}%)`
          }} />

          {(path.milestones || []).map((m, i) => (
            <div key={m._id || i} style={{ position: 'relative', paddingBottom: i < (path.milestones?.length - 1) ? '28px' : '0' }}>
              {/* Dot */}
              <div style={{ position: 'absolute', left: '-36px', top: '4px', ...dotStyle(m.status) }}>
                {statusIcon(m.status)}
              </div>

              {/* Card */}
              <div style={{
                background: m.status === 'completed' ? '#f0fdf4' : m.status === 'current' ? 'white' : 'var(--color-bg-secondary)',
                border: `1.5px solid ${m.status === 'completed' ? '#bbf7d0' : m.status === 'current' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: '14px', padding: '16px 20px',
                boxShadow: m.status === 'current' ? 'var(--shadow-glow)' : 'none',
                transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
                        STEP {m.order || i + 1}
                      </span>
                      <span className={`badge ${m.status === 'completed' ? 'badge-success' : m.status === 'current' ? 'badge-info' : 'badge-neutral'}`}>
                        {m.status === 'completed' ? '✓ Completed' : m.status === 'current' ? '● In Progress' : '○ Pending'}
                      </span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{m.title}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{m.description}</div>
                    {m.completedAt && (
                      <div style={{ fontSize: '11px', color: 'var(--color-success)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiCheck size={10} /> Completed {typeof m.completedAt === 'string' ? m.completedAt : new Date(m.completedAt).toLocaleDateString('en-IN')}
                      </div>
                    )}
                    {m.dueDate && m.status !== 'completed' && (
                      <div style={{ fontSize: '11px', color: m.status === 'current' ? 'var(--color-primary)' : 'var(--color-text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiClock size={10} /> Due: {m.dueDate}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action button for current milestone */}
                {m.status === 'current' && (
                  <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--color-border)' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={advanceMilestone}
                      disabled={saving}
                      id={`complete-milestone-${m._id || i}`}
                    >
                      {saving ? 'Saving…' : 'Mark as Complete ✓'}
                    </button>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginLeft: '12px' }}>
                      This will advance to the next step
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Completion message */}
        {path.progressPercent === 100 && (
          <div style={{ textAlign: 'center', marginTop: '32px', padding: '32px', background: 'var(--color-success-bg)', borderRadius: '16px', border: '2px solid #bbf7d0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-success)', marginBottom: '8px' }}>Recovery Complete!</div>
            <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              You've completed all milestones. Your risk status will be re-evaluated by your faculty.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
