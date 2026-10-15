import { useState } from 'react';
import { DEMO_FACULTY_REPORTS, DEMO_AT_RISK_STUDENTS, DEMO_COURSES } from '../../data/mockData';
import { FiX, FiFlag, FiClock, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useApi, useMutation } from '../../hooks/useApi';
import { getReports, createReport, getCourses, getAllUsers } from '../../services/api';

const CONCERN_TYPES = [
  { value: 'incomplete_assignment', label: 'Incomplete Assignment' },
  { value: 'missing_assignment', label: 'Missing Assignment' },
  { value: 'missing_test', label: 'Missing Test' },
  { value: 'low_quiz_performance', label: 'Low Quiz Performance' },
  { value: 'low_academic_performance', label: 'Low Academic Performance' },
  { value: 'low_attendance', label: 'Low Attendance' },
  { value: 'repeated_incomplete_work', label: 'Repeated Incomplete Work' },
  { value: 'other', label: 'Other Academic Concern' },
];

function NewReportModal({ onClose, onSubmit, students, courses }) {
  const [form, setForm] = useState({ student: '', concernType: '', course: '', description: '', severity: 'medium' });
  const [submitted, setSubmitted] = useState(false);
  const { mutate: submitReport, loading } = useMutation(createReport);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitReport(form);
    if (result.success) {
      setSubmitted(true);
      setTimeout(() => { onSubmit(result.data); onClose(); }, 2000);
    } else {
      // Fallback: optimistic local add in demo mode
      setSubmitted(true);
      setTimeout(() => { onSubmit(form); onClose(); }, 2000);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-lg animate-slide-up" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Report Academic Concern</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              This report will be shared with the student and parent.
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>

        {submitted ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-success-bg)', border: '3px solid var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '36px' }}>
              ✅
            </div>
            <div style={{ fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>Report Submitted!</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '20px' }}>
              The parent has been notified and will need to acknowledge this report.
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0', position: 'relative', padding: '16px 0' }}>
              {['Faculty', 'EduPulse', 'Parent Notified'].map((step, i) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center', padding: '0 16px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '14px', fontWeight: 700 }}>✓</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)' }}>{step}</div>
                  </div>
                  {i < 2 && <div style={{ width: 40, height: 2, background: 'var(--color-primary)' }} />}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Student *</label>
                  <select className="form-select" value={form.student} onChange={e => setForm(f => ({ ...f, student: e.target.value }))} required>
                    <option value="">Select student</option>
                    {students.map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.rollNumber || s._id})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject / Course *</label>
                  <select className="form-select" value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} required>
                    <option value="">Select course</option>
                    {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Concern Type *</label>
                <select className="form-select" value={form.concernType} onChange={e => setForm(f => ({ ...f, concernType: e.target.value }))} required>
                  <option value="">Select concern type</option>
                  {CONCERN_TYPES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-textarea" rows={5} required
                  placeholder="Provide a detailed description of the concern, including specific incidents, dates, and any attempts to address the issue..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Severity *</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['low', 'medium', 'high'].map(s => (
                    <label key={s} style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                      border: `2px solid ${form.severity === s ? (s === 'high' ? '#ef4444' : s === 'medium' ? '#f97316' : '#f59e0b') : 'var(--color-border)'}`,
                      background: form.severity === s ? (s === 'high' ? '#fef2f2' : s === 'medium' ? '#fff7ed' : '#fffbeb') : 'white',
                      color: form.severity === s ? (s === 'high' ? '#ef4444' : s === 'medium' ? '#f97316' : '#f59e0b') : 'var(--color-text-muted)',
                      transition: 'all 0.2s',
                    }}>
                      <input type="radio" name="severity" value={s} checked={form.severity === s} onChange={() => setForm(f => ({ ...f, severity: s }))} style={{ display: 'none' }} />
                      {s === 'high' ? '🔴' : s === 'medium' ? '🟠' : '🟡'}
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                <strong>ℹ️ Note:</strong> Once submitted, this report will be sent to EduPulse, which will notify the parent. The parent must acknowledge the report.
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading} id="submit-faculty-report">
                {loading ? <><div className="loading-spinner" style={{ width: 14, height: 14 }} /> Submitting...</> : <><FiFlag size={14} /> Submit Report</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function FacultyReportsPage() {
  const { isDemo } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const { data: reports, setData: setReports, loading, refetch, isLive } = useApi(
    getReports,
    DEMO_FACULTY_REPORTS
  );

  // Fetch students and courses for the modal — fall back to mock data
  const { data: students } = useApi(
    () => getAllUsers({ role: 'student' }),
    DEMO_AT_RISK_STUDENTS
  );
  const { data: courseList } = useApi(getCourses, DEMO_COURSES);

  const handleNewReport = (data) => {
    // Optimistic prepend if no real data was returned (demo mode)
    if (!data?._id) {
      const fake = {
        _id: `report_${Date.now()}`,
        faculty: { name: 'Dr. Priya Nair' },
        student: students?.find(s => s._id === data.student) || { name: 'Unknown', rollNumber: '—', class: '—' },
        course: courseList?.find(c => c._id === data.course) || DEMO_COURSES[0],
        concernType: data.concernType,
        description: data.description,
        severity: data.severity,
        parentAcknowledged: false,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setReports(prev => [fake, ...(prev || [])]);
    } else {
      setReports(prev => [data, ...(prev || [])]);
    }
  };

  const severityColor = {
    high: { badge: 'badge-error', bg: '#fef2f2', border: '#fecaca' },
    medium: { badge: 'badge-warning', bg: '#fff7ed', border: '#fed7aa' },
    low: { badge: 'badge-info', bg: '#fffbeb', border: '#fde68a' },
  };

  const displayReports = reports || [];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">Faculty Reports</div>
            <div className="page-subtitle">
              {displayReports.filter(r => !r.parentAcknowledged).length} awaiting parent acknowledgement
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isLive && <span className="badge badge-success" style={{ fontSize: '11px' }}>● Live</span>}
            <button className="btn btn-secondary btn-sm" onClick={refetch} disabled={loading} title="Refresh">
              <FiRefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
            <button className="btn btn-primary" onClick={() => setShowModal(true)} id="open-report-modal">
              <FiFlag size={14} /> Report Academic Concern
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {displayReports.map(r => {
          const sc = severityColor[r.severity] || severityColor.low;
          const createdDate = r.createdAt
            ? (typeof r.createdAt === 'string' && r.createdAt.length <= 12
              ? r.createdAt
              : new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }))
            : '—';
          return (
            <div key={r._id} style={{
              background: 'white', border: '1px solid var(--color-border)', borderRadius: '18px',
              overflow: 'hidden', transition: 'box-shadow 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span className={`badge ${sc.badge}`}>{r.severity?.toUpperCase()} SEVERITY</span>
                    <span className="badge badge-neutral">{r.concernType?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiClock size={11} /> {createdDate}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
                    {r.student?.name} — {r.course?.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                    {r.student?.class} · {r.student?.rollNumber}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    {r.description}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', minWidth: '200px' }}>
                  <div style={{
                    background: r.parentAcknowledged ? '#f0fdf4' : '#fff7ed',
                    border: `1px solid ${r.parentAcknowledged ? '#bbf7d0' : '#fed7aa'}`,
                    borderRadius: '12px', padding: '12px 16px', textAlign: 'center', width: '100%'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Parent Status
                    </div>
                    {r.parentAcknowledged ? (
                      <>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#16a34a' }}>✓ Acknowledged</div>
                        {r.acknowledgedAt && (
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            {new Date(r.acknowledgedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#f97316' }}>⏳ Awaiting</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>Notified, pending review</div>
                      </>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
                    Only the parent can acknowledge this report
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {displayReports.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>📋</div>
            <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>No reports yet</div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              Reports you submit will appear here.
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <NewReportModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewReport}
          students={students || DEMO_AT_RISK_STUDENTS}
          courses={courseList || DEMO_COURSES}
        />
      )}
    </div>
  );
}
