import { useState } from 'react';
import { DEMO_AT_RISK_STUDENTS, DEMO_ASSIGNMENTS, DEMO_QUIZZES, DEMO_ATTENDANCE, DEMO_RECOVERY_PATH, DEMO_FACULTY_REPORTS } from '../../data/mockData';
import { FiArrowLeft, FiFlag, FiCheck, FiClock, FiRefreshCw } from 'react-icons/fi';
import { useApi } from '../../hooks/useApi';
import { getAllRiskFlags } from '../../services/api';

const RISK_COLOR = { high: '#ef4444', medium: '#f97316', low: '#f59e0b' };

function StudentProfile({ student, onBack }) {
  const att = DEMO_ATTENDANCE;
  const recovery = DEMO_RECOVERY_PATH;
  const reports = DEMO_FACULTY_REPORTS.filter(r => r.student._id === student._id);

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={onBack} className="btn btn-secondary btn-sm"><FiArrowLeft size={14} /> Back</button>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Student Profile</h2>
      </div>

      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        border: '1px solid #bbf7d0', borderRadius: '20px',
        padding: '28px', marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap'
      }}>
        <div className="avatar avatar-xl">{student.name[0]}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>{student.name}</div>
          <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
            {student.class} · Roll: {student.rollNumber}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className={`badge badge-${student.riskLevel}-risk`}>{student.riskLevel.toUpperCase()} RISK</span>
            <span className="badge badge-neutral">Semester 5</span>
            <span className="badge badge-info">CSE Dept.</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', textAlign: 'center' }}>
          {[
            { label: 'Attendance', value: `${student.attendance}%`, color: student.attendance < 75 ? '#ef4444' : '#16a34a' },
            { label: 'Performance', value: `${student.performance}%`, color: student.performance < 50 ? '#ef4444' : '#f97316' },
            { label: 'Assignments', value: `${student.assignmentCompletion}%`, color: student.assignmentCompletion < 60 ? '#ef4444' : '#16a34a' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: '12px', padding: '12px 16px' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        {/* Risk Breakdown */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px', color: '#ef4444' }}>⚠️ Risk Analysis</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {student.reasons.map(r => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca' }}>
                <span style={{ fontSize: '16px' }}>🔴</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#ef4444' }}>{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recovery Summary */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>🛤️ Recovery Progress</div>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Progress</span>
              <span style={{ fontWeight: 700 }}>{recovery.progressPercent}%</span>
            </div>
            <div className="progress-bar-container" style={{ height: '10px' }}>
              <div className="progress-bar-fill" style={{ width: `${recovery.progressPercent}%` }} />
            </div>
          </div>
          {recovery.milestones.slice(0, 4).map(m => (
            <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--color-border-light)' }}>
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                background: m.status === 'completed' ? 'var(--color-primary)' : m.status === 'current' ? 'white' : 'var(--color-bg-secondary)',
                border: `2px solid ${m.status !== 'pending' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {m.status === 'completed' && <FiCheck size={10} color="white" />}
                {m.status === 'current' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)' }} />}
              </div>
              <span style={{ fontSize: '12px', color: m.status === 'pending' ? 'var(--color-text-muted)' : 'var(--color-text-primary)', fontWeight: m.status !== 'pending' ? 600 : 400 }}>
                {m.title}
              </span>
              <span className={`badge ${m.status === 'completed' ? 'badge-success' : m.status === 'current' ? 'badge-info' : 'badge-neutral'}`} style={{ marginLeft: 'auto', fontSize: '10px' }}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Course Attendance Breakdown */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title" style={{ marginBottom: '16px' }}>📅 Course Attendance</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {att.courses.map(c => (
            <div key={c.course._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{c.course.name}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: c.percentage < 75 ? '#ef4444' : '#16a34a' }}>{c.percentage}%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${c.percentage}%`, background: c.percentage < 75 ? '#ef4444' : 'var(--color-primary)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Reports */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Faculty Reports for this Student</div>
          <a href="/reports" className="btn btn-primary btn-sm">
            <FiFlag size={12} /> New Report
          </a>
        </div>
        {reports.length === 0 ? (
          <div className="empty-state"><div className="empty-state-text">No reports submitted</div></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {reports.map(r => (
              <div key={r._id} style={{ padding: '16px', background: 'var(--color-bg-secondary)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>{r.course.name} — {r.concernType.replace(/_/g, ' ')}</span>
                  <span className={`badge badge-${r.severity === 'high' ? 'error' : r.severity === 'medium' ? 'warning' : 'info'}`}>{r.severity}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{r.description}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Reported {r.createdAt}</span>
                  {r.parentAcknowledged
                    ? <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>✓ Parent Acknowledged on {new Date(r.acknowledgedAt).toLocaleDateString('en-IN')}</span>
                    : <span style={{ fontSize: '12px', color: '#f97316', fontWeight: 700 }}>⏳ Awaiting Parent Acknowledgement</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AtRiskPage() {
  const [selected, setSelected] = useState(null);

  // Fetch live risk flags; each flag has a populated .student field
  const { data: riskFlags, loading, refetch, isLive } = useApi(
    getAllRiskFlags,
    null // no fallback — we derive students below
  );

  // Normalise: API returns RiskFlag[] with .student populated, mock returns student-shaped objects
  const students = riskFlags
    ? riskFlags.map(f => ({
        _id: f.student?._id || f._id,
        name: f.student?.name || 'Unknown',
        rollNumber: f.student?.rollNumber || '—',
        class: f.student?.class || '—',
        riskLevel: f.level,
        reasons: f.reasons || [],
        attendance: f.attendancePercent ?? 0,
        performance: f.quizAveragePercent ?? 0,
        assignmentCompletion: f.assignmentCompletionPercent ?? 0,
        quizAverage: f.quizAveragePercent ?? 0,
      }))
    : DEMO_AT_RISK_STUDENTS;

  if (selected) return <StudentProfile student={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">At-Risk Students</div>
            <div className="page-subtitle">{students.length} students flagged across your courses</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isLive && <span className="badge badge-success" style={{ fontSize: '11px' }}>● Live</span>}
            <button className="btn btn-secondary btn-sm" onClick={refetch} disabled={loading} title="Refresh">
              <FiRefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Risk Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { level: 'high', label: 'High Risk', count: students.filter(s => s.riskLevel === 'high').length, color: '#ef4444', bg: '#fef2f2', emoji: '🔴' },
          { level: 'medium', label: 'Medium Risk', count: students.filter(s => s.riskLevel === 'medium').length, color: '#f97316', bg: '#fff7ed', emoji: '🟠' },
          { level: 'low', label: 'Low Risk', count: students.filter(s => s.riskLevel === 'low').length, color: '#f59e0b', bg: '#fffbeb', emoji: '🟡' },
        ].map(r => (
          <div key={r.level} className="stat-card" style={{ background: r.bg, border: `1px solid ${r.color}30` }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{r.emoji}</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: r.color, fontFamily: "'Space Grotesk',sans-serif" }}>{r.count}</div>
            <div style={{ fontSize: '13px', color: r.color, fontWeight: 600 }}>{r.label}</div>
          </div>
        ))}
      </div>

      {/* Student Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {students.map(s => (
          <div key={s._id} style={{
            background: 'white', border: '1px solid var(--color-border)', borderRadius: '16px',
            padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px',
            transition: 'all 0.2s', cursor: 'default', flexWrap: 'wrap',
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div className="avatar avatar-md" style={{ background: `${RISK_COLOR[s.riskLevel]}20`, color: RISK_COLOR[s.riskLevel], border: `2px solid ${RISK_COLOR[s.riskLevel]}30` }}>
              {s.name[0]}
            </div>
            <div style={{ flex: '0 0 180px' }}>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>{s.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{s.class} · {s.rollNumber}</div>
            </div>
            <div style={{ display: 'flex', gap: '24px', flex: 1, flexWrap: 'wrap' }}>
              {[
                { label: 'Attendance', value: `${s.attendance}%`, isLow: s.attendance < 75 },
                { label: 'Performance', value: `${s.performance}%`, isLow: s.performance < 50 },
                { label: 'Assignments', value: `${s.assignmentCompletion}%`, isLow: s.assignmentCompletion < 60 },
                { label: 'Quiz Avg', value: `${s.quizAverage}%`, isLow: s.quizAverage < 50 },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>{m.label}</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: m.isLow ? '#ef4444' : '#16a34a', fontFamily: "'Space Grotesk',sans-serif" }}>{m.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
              <span className={`badge badge-${s.riskLevel}-risk`}>{s.riskLevel.toUpperCase()} RISK</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelected(s)} id={`view-student-${s._id}`}>
                  View Profile
                </button>
                <a href="/reports" className="btn btn-primary btn-sm">
                  <FiFlag size={12} /> Report
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
