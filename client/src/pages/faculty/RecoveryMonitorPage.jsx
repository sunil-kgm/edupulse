import { useState, useCallback } from 'react';
import { DEMO_AT_RISK_STUDENTS } from '../../data/mockData';
import { FiChevronDown, FiChevronUp, FiCheck, FiClock, FiRefreshCw } from 'react-icons/fi';
import { useApi } from '../../hooks/useApi';
import { getAllRiskFlags, getStudentRecovery } from '../../services/api';

const RISK_COLOR = { high: '#ef4444', medium: '#f97316', low: '#f59e0b' };

// Hardcoded demo recovery data used when backend is unavailable
const DEMO_RECOVERY_DATA = [
  {
    student: { name: 'Arun Kumar', rollNumber: 'CSE2024001', class: 'III CSE - A' },
    riskLevel: 'high',
    course: 'Data Structures',
    progress: 33,
    milestones: [
      { title: 'Attend all remaining DS classes', status: 'completed', dueDate: '2026-09-15' },
      { title: 'Complete Assignment 3: BST Implementation', status: 'completed', dueDate: '2026-09-20' },
      { title: 'Achieve 60%+ in Practice Quiz', status: 'pending', dueDate: '2026-09-30' },
      { title: 'Submit Lab Record Up-to-date', status: 'pending', dueDate: '2026-10-05' },
      { title: 'Score 50%+ in Internal Test', status: 'pending', dueDate: '2026-10-15' },
      { title: 'Final Review with Faculty', status: 'pending', dueDate: '2026-10-20' },
    ],
  },
  {
    student: { name: 'Priya Lakshmi', rollNumber: 'CSE2024015', class: 'III CSE - A' },
    riskLevel: 'medium',
    course: 'DBMS',
    progress: 50,
    milestones: [
      { title: 'Submit overdue DBMS assignments', status: 'completed', dueDate: '2026-09-10' },
      { title: 'Attend lab sessions without absence', status: 'completed', dueDate: '2026-09-18' },
      { title: 'Score 55%+ in next quiz', status: 'completed', dueDate: '2026-09-25' },
      { title: 'Prepare for internal exam', status: 'pending', dueDate: '2026-10-08' },
    ],
  },
  {
    student: { name: 'Rahul Singh', rollNumber: 'CSE2024032', class: 'II CSE - A' },
    riskLevel: 'low',
    course: 'Operating Systems',
    progress: 75,
    milestones: [
      { title: 'Clear pending OS assignments', status: 'completed', dueDate: '2026-09-08' },
      { title: 'Attend all lab sessions', status: 'completed', dueDate: '2026-09-15' },
      { title: 'Achieve 65%+ in mock test', status: 'completed', dueDate: '2026-09-22' },
      { title: 'Final internal exam preparation', status: 'pending', dueDate: '2026-10-01' },
    ],
  },
];

export default function RecoveryMonitorPage() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');

  // Fetch at-risk students from API
  const { data: riskFlags, loading, refetch, isLive } = useApi(
    getAllRiskFlags,
    null
  );

  // Build display data: from API flags or fallback to demo
  const recoveryData = riskFlags
    ? riskFlags.map(f => ({
        student: {
          _id: f.student?._id,
          name: f.student?.name || 'Unknown',
          rollNumber: f.student?.rollNumber || '—',
          class: f.student?.class || '—',
        },
        riskLevel: f.level,
        course: 'Multiple Courses',
        progress: f.progressPercent ?? Math.round(
          (2 / 6) * 100 // default if no recovery path attached
        ),
        milestones: f.milestones || [],
        reasons: f.reasons || [],
        _flagId: f._id,
      }))
    : DEMO_RECOVERY_DATA;

  const filtered = recoveryData.filter(r => filter === 'all' || r.riskLevel === filter);
  const avgProgress = recoveryData.length > 0
    ? Math.round(recoveryData.reduce((s, r) => s + (r.progress || 0), 0) / recoveryData.length)
    : 0;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">Recovery Monitor</div>
            <div className="page-subtitle">Track at-risk student recovery plan progress</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {isLive && <span className="badge badge-success" style={{ fontSize: '11px' }}>● Live</span>}
            <button className="btn btn-secondary btn-sm" onClick={refetch} disabled={loading} title="Refresh">
              <FiRefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
            {['all', 'high', 'medium', 'low'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{
                  padding: '6px 14px', borderRadius: '99px',
                  border: filter === f ? `2px solid ${f === 'all' ? '#374151' : RISK_COLOR[f]}` : '1px solid var(--color-border)',
                  background: filter === f ? (f === 'all' ? '#f3f4f6' : RISK_COLOR[f] + '15') : 'white',
                  fontSize: '12px', fontWeight: 700,
                  color: filter === f && f !== 'all' ? RISK_COLOR[f] : 'var(--color-text-muted)',
                  cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s'
                }}
              >{f === 'all' ? 'All' : f + ' Risk'}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total in Recovery', value: recoveryData.length, color: '#3b82f6', icon: '🔄' },
          { label: 'High Risk', value: recoveryData.filter(r => r.riskLevel === 'high').length, color: '#ef4444', icon: '🚨' },
          { label: 'Avg Progress', value: `${avgProgress}%`, color: '#16a34a', icon: '📈' },
          { label: 'On Track', value: recoveryData.filter(r => (r.progress || 0) >= 50).length, color: '#7c3aed', icon: '✅' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recovery Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.map((rec, i) => {
          const isOpen = expanded === i;
          const color = RISK_COLOR[rec.riskLevel] || '#6b7280';
          const milestones = rec.milestones || [];
          const done = milestones.filter(m => m.status === 'completed').length;
          const progress = rec.progress ?? (milestones.length > 0 ? Math.round((done / milestones.length) * 100) : 0);
          return (
            <div key={i} className="card" style={{ borderLeft: `4px solid ${color}`, padding: 0, overflow: 'hidden' }}>
              {/* Header */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', cursor: 'pointer' }}
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                <div className="avatar avatar-md" style={{ background: color + '15', color, fontWeight: 700, flexShrink: 0 }}>{rec.student.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '2px' }}>{rec.student.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    {rec.student.class} · {rec.student.rollNumber} · Course: {rec.course}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color, fontFamily: "'Space Grotesk',sans-serif" }}>{progress}%</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Progress</div>
                  </div>
                  <span className={`badge badge-${rec.riskLevel}-risk`} style={{ textTransform: 'capitalize' }}>{rec.riskLevel} Risk</span>
                  {isOpen ? <FiChevronUp size={18} color="var(--color-text-muted)" /> : <FiChevronDown size={18} color="var(--color-text-muted)" />}
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ padding: '0 20px 12px', background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', padding: '10px 0 6px' }}>
                  <span>Recovery Progress</span>
                  <span>{done}/{milestones.length} milestones complete</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{
                    width: `${progress}%`,
                    background: progress >= 60 ? '#16a34a' : progress >= 40 ? '#f97316' : '#ef4444',
                    transition: 'width 0.5s'
                  }} />
                </div>
              </div>

              {/* Milestones (expanded) */}
              {isOpen && (
                <div style={{ padding: '16px 20px', borderTop: '1px solid var(--color-border)' }}>
                  {/* Risk Reasons */}
                  {rec.reasons?.length > 0 && (
                    <div style={{ marginBottom: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {rec.reasons.map(r => (
                        <span key={r} style={{ fontSize: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '99px', padding: '3px 10px', color: '#ef4444', fontWeight: 600 }}>
                          {r}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: 'var(--color-text-secondary)' }}>Recovery Milestones</div>
                  {milestones.length === 0 ? (
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '13px', padding: '16px', textAlign: 'center' }}>
                      No milestone data available. Create a recovery path for this student.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {milestones.map((m, mi) => (
                        <div key={m._id || mi} style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '12px 14px',
                          background: m.status === 'completed' ? '#f0fdf4' : 'var(--color-bg-secondary)',
                          border: `1px solid ${m.status === 'completed' ? '#bbf7d0' : 'var(--color-border)'}`,
                          borderRadius: '10px'
                        }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.status === 'completed' ? '#16a34a' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {m.status === 'completed'
                              ? <FiCheck size={14} color="white" strokeWidth={3} />
                              : <FiClock size={14} color="#9ca3af" />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: m.status === 'completed' ? '#16a34a' : 'var(--color-text-primary)', textDecoration: m.status === 'completed' ? 'line-through' : 'none' }}>{m.title}</div>
                            {m.dueDate && <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Due: {m.dueDate}</div>}
                          </div>
                          <span className={`badge ${m.status === 'completed' ? 'badge-success' : m.status === 'current' ? 'badge-info' : 'badge-neutral'}`}>
                            {m.status === 'completed' ? 'Done' : m.status === 'current' ? 'In Progress' : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px', opacity: 0.3 }}>🎉</div>
            <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>No students in this category</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>All clear for {filter} risk!</div>
          </div>
        )}
      </div>
    </div>
  );
}
