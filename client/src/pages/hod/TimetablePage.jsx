import { useState } from 'react';
import { FiPlus, FiX, FiEdit2 } from 'react-icons/fi';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM (Lunch)', '2:00 PM', '3:00 PM', '4:00 PM'];

const CLASS_OPTIONS = ['I CSE - A', 'I CSE - B', 'II CSE - A', 'III CSE - A', 'III CSE - B', 'IV CSE - A'];

const SUBJECT_COLORS = {
  'Data Structures': '#3b82f6',
  'DBMS': '#16a34a',
  'OS': '#7c3aed',
  'CN': '#f97316',
  'Data Structures Lab': '#0ea5e9',
  'DBMS Lab': '#22c55e',
  'CN Lab': '#fb923c',
  'Engineering Mathematics': '#6366f1',
  'Programming in C': '#ec4899',
  'Physics': '#14b8a6',
  'English': '#f59e0b',
  'Digital Electronics': '#8b5cf6',
  'Discrete Math': '#10b981',
  'Machine Learning': '#ef4444',
  'Cloud Computing': '#0284c7',
  'Project': '#d97706',
};

const INITIAL_TIMETABLE = {
  'I CSE - A': {
    Monday:    ['Engineering Mathematics', 'Engineering Mathematics', 'Programming in C', 'Physics', 'BREAK', 'English', 'Free', 'Free'],
    Tuesday:   ['Programming in C', 'Physics', 'Engineering Mathematics', 'English', 'BREAK', 'Programming in C', 'Free', 'Free'],
    Wednesday: ['Physics', 'Engineering Mathematics', 'English', 'Free', 'BREAK', 'Programming in C', 'Free', 'Free'],
    Thursday:  ['English', 'Programming in C', 'Physics', 'Engineering Mathematics', 'BREAK', 'Free', 'Free', 'Free'],
    Friday:    ['Engineering Mathematics', 'Physics', 'English', 'Programming in C', 'BREAK', 'Free', 'Free', 'Free'],
    Saturday:  ['Programming in C', 'English', 'Free', 'Free', 'BREAK', 'Free', 'Free', 'Free'],
  },
  'I CSE - B': {
    Monday:    ['Physics', 'Physics', 'Engineering Mathematics', 'Programming in C', 'BREAK', 'English', 'Free', 'Free'],
    Tuesday:   ['Engineering Mathematics', 'English', 'Programming in C', 'Physics', 'BREAK', 'Engineering Mathematics', 'Free', 'Free'],
    Wednesday: ['Programming in C', 'English', 'Physics', 'Free', 'BREAK', 'Engineering Mathematics', 'Free', 'Free'],
    Thursday:  ['Physics', 'Engineering Mathematics', 'English', 'Programming in C', 'BREAK', 'Free', 'Free', 'Free'],
    Friday:    ['English', 'Programming in C', 'Engineering Mathematics', 'Physics', 'BREAK', 'Free', 'Free', 'Free'],
    Saturday:  ['Engineering Mathematics', 'Programming in C', 'Free', 'Free', 'BREAK', 'Free', 'Free', 'Free'],
  },
  'II CSE - A': {
    Monday:    ['Data Structures', 'Data Structures', 'Digital Electronics', 'Discrete Math', 'BREAK', 'Data Structures Lab', 'Data Structures Lab', 'Free'],
    Tuesday:   ['Discrete Math', 'Digital Electronics', 'Data Structures', 'Free', 'BREAK', 'Digital Electronics', 'Free', 'Free'],
    Wednesday: ['Digital Electronics', 'Data Structures', 'Discrete Math', 'Digital Electronics', 'BREAK', 'Free', 'Free', 'Free'],
    Thursday:  ['Data Structures', 'Discrete Math', 'Digital Electronics', 'Data Structures', 'BREAK', 'Free', 'Free', 'Free'],
    Friday:    ['Discrete Math', 'Digital Electronics', 'Data Structures', 'Discrete Math', 'BREAK', 'Free', 'Free', 'Free'],
    Saturday:  ['Digital Electronics', 'Discrete Math', 'Free', 'Free', 'BREAK', 'Free', 'Free', 'Free'],
  },
  'III CSE - A': {
    Monday:    ['Data Structures', 'Data Structures', 'DBMS', 'DBMS', 'BREAK', 'OS', 'CN', 'Free'],
    Tuesday:   ['OS', 'CN', 'Data Structures Lab', 'Data Structures Lab', 'BREAK', 'DBMS', 'Free', 'Free'],
    Wednesday: ['CN', 'OS', 'DBMS', 'Free', 'BREAK', 'Data Structures', 'CN Lab', 'CN Lab'],
    Thursday:  ['DBMS', 'Data Structures', 'OS', 'CN', 'BREAK', 'Free', 'Free', 'Free'],
    Friday:    ['Data Structures', 'DBMS', 'CN', 'OS', 'BREAK', 'DBMS Lab', 'DBMS Lab', 'Free'],
    Saturday:  ['OS', 'CN', 'Free', 'Free', 'BREAK', 'Free', 'Free', 'Free'],
  },
  'III CSE - B': {
    Monday:    ['CN', 'CN', 'OS', 'DBMS', 'BREAK', 'Data Structures', 'Free', 'Free'],
    Tuesday:   ['DBMS', 'OS', 'CN Lab', 'CN Lab', 'BREAK', 'Data Structures', 'Free', 'Free'],
    Wednesday: ['OS', 'DBMS', 'CN', 'Data Structures', 'BREAK', 'DBMS Lab', 'DBMS Lab', 'Free'],
    Thursday:  ['CN', 'DBMS', 'Data Structures', 'OS', 'BREAK', 'Free', 'Free', 'Free'],
    Friday:    ['DBMS', 'CN', 'OS', 'Data Structures', 'BREAK', 'Data Structures Lab', 'Data Structures Lab', 'Free'],
    Saturday:  ['Data Structures', 'OS', 'Free', 'Free', 'BREAK', 'Free', 'Free', 'Free'],
  },
  'IV CSE - A': {
    Monday:    ['Machine Learning', 'Machine Learning', 'Cloud Computing', 'Project', 'BREAK', 'Machine Learning', 'Free', 'Free'],
    Tuesday:   ['Cloud Computing', 'Project', 'Machine Learning', 'Cloud Computing', 'BREAK', 'Project', 'Free', 'Free'],
    Wednesday: ['Project', 'Machine Learning', 'Cloud Computing', 'Machine Learning', 'BREAK', 'Cloud Computing', 'Free', 'Free'],
    Thursday:  ['Machine Learning', 'Cloud Computing', 'Project', 'Machine Learning', 'BREAK', 'Free', 'Free', 'Free'],
    Friday:    ['Cloud Computing', 'Machine Learning', 'Machine Learning', 'Cloud Computing', 'BREAK', 'Project', 'Project', 'Free'],
    Saturday:  ['Project', 'Cloud Computing', 'Free', 'Free', 'BREAK', 'Free', 'Free', 'Free'],
  },
};

function AddPeriodModal({ selectedClass, onClose, onSave }) {
  const [form, setForm] = useState({ day: 'Monday', period: '0', subject: '' });
  const [saving, setSaving] = useState(false);
  const customSubjects = Object.keys(SUBJECT_COLORS);

  const handle = () => {
    if (!form.subject) return;
    setSaving(true);
    setTimeout(() => {
      onSave(form.day, Number(form.period), form.subject);
      onClose();
    }, 700);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-sm animate-slide-up">
        <div className="modal-header">
          <div className="modal-title">Assign Period — {selectedClass}</div>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Day</label>
            <select className="form-input" value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))}>
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Period / Time Slot</label>
            <select className="form-input" value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))}>
              {PERIODS.map((p, i) => (
                p.includes('Lunch')
                  ? null
                  : <option key={i} value={i}>{p}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Subject *</label>
            <select className="form-input" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
              <option value="">Select subject...</option>
              {customSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ background: 'var(--color-bg-secondary)', borderRadius: '10px', padding: '12px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            💡 This will overwrite any existing subject in that slot.
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handle} disabled={!form.subject || saving}>
            {saving ? 'Saving...' : <><FiPlus size={14} /> Assign Period</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function ClearPeriodModal({ selectedClass, onClose, onClear }) {
  const [form, setForm] = useState({ day: 'Monday', period: '0' });
  const [saving, setSaving] = useState(false);

  const handle = () => {
    setSaving(true);
    setTimeout(() => { onClear(form.day, Number(form.period)); onClose(); }, 700);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container modal-sm animate-slide-up">
        <div className="modal-header">
          <div className="modal-title">Clear Period — {selectedClass}</div>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Day</label>
            <select className="form-input" value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))}>
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Period / Time Slot</label>
            <select className="form-input" value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))}>
              {PERIODS.map((p, i) => p.includes('Lunch') ? null : <option key={i} value={i}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-error" onClick={handle} disabled={saving}
            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
            {saving ? 'Clearing...' : 'Clear Period'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState('I CSE - A');
  const [timetable, setTimetable] = useState(INITIAL_TIMETABLE);
  const [showAdd, setShowAdd] = useState(false);
  const [showClear, setShowClear] = useState(false);

  const schedule = timetable[selectedClass] || {};

  const handleSave = (day, periodIdx, subject) => {
    setTimetable(prev => {
      const classSchedule = { ...(prev[selectedClass] || {}) };
      const daySchedule = [...(classSchedule[day] || Array(8).fill('Free'))];
      daySchedule[periodIdx] = subject;
      return { ...prev, [selectedClass]: { ...classSchedule, [day]: daySchedule } };
    });
  };

  const handleClear = (day, periodIdx) => {
    setTimetable(prev => {
      const classSchedule = { ...(prev[selectedClass] || {}) };
      const daySchedule = [...(classSchedule[day] || Array(8).fill('Free'))];
      daySchedule[periodIdx] = 'Free';
      return { ...prev, [selectedClass]: { ...classSchedule, [day]: daySchedule } };
    });
  };

  const subjectCount = {};
  DAYS.forEach(day => {
    (schedule[day] || []).forEach(s => {
      if (s && s !== 'Free' && s !== 'BREAK') subjectCount[s] = (subjectCount[s] || 0) + 1;
    });
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Timetable</div>
          <div className="page-subtitle">Weekly schedule for {selectedClass}</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            className="form-input"
            style={{ width: 'auto', minWidth: '160px' }}
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
          >
            {CLASS_OPTIONS.map(c => <option key={c}>{c}</option>)}
          </select>
          <button className="btn btn-secondary" onClick={() => setShowClear(true)}>
            <FiEdit2 size={14} /> Clear Period
          </button>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <FiPlus size={14} /> Assign Period
          </button>
        </div>
      </div>

      {/* Subject legend */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {Object.entries(subjectCount).map(([subject, count]) => {
          const color = SUBJECT_COLORS[subject] || '#6b7280';
          return (
            <div key={subject} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, padding: '4px 10px', background: color + '15', border: `1px solid ${color}40`, borderRadius: '8px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '3px', background: color }} />
              {subject} <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>({count})</span>
            </div>
          );
        })}
        {Object.keys(subjectCount).length === 0 && (
          <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', padding: '4px 0' }}>
            No periods assigned yet. Click "Assign Period" to start building the timetable.
          </div>
        )}
      </div>

      {/* Timetable Grid */}
      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
          <thead>
            <tr style={{ background: 'var(--color-bg-secondary)' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--color-border)', width: '100px' }}>
                Time
              </th>
              {DAYS.map(day => (
                <th key={day} style={{ padding: '14px 12px', textAlign: 'center', fontSize: '13px', fontWeight: 700, borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((period, pi) => (
              <tr key={period} style={{ background: period.includes('Lunch') ? '#fffbeb' : 'white' }}>
                <td style={{ padding: '10px 16px', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border-light)', whiteSpace: 'nowrap' }}>
                  {period}
                </td>
                {DAYS.map(day => {
                  const subject = schedule[day]?.[pi] || (period.includes('Lunch') ? 'BREAK' : 'Free');
                  const color = SUBJECT_COLORS[subject];
                  const isBreak = subject === 'BREAK' || period.includes('Lunch');
                  const isFree = subject === 'Free' || !subject;
                  return (
                    <td key={day} style={{ padding: '8px', borderBottom: '1px solid var(--color-border-light)', textAlign: 'center' }}>
                      {isBreak ? (
                        <div style={{ padding: '6px 10px', background: '#fffbeb', borderRadius: '8px', fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>
                          🍽️ Lunch
                        </div>
                      ) : isFree ? (
                        <div
                          onClick={() => { setShowAdd(true); }}
                          style={{ padding: '10px 6px', fontSize: '11px', color: 'var(--color-text-muted)', cursor: 'pointer', borderRadius: '8px', border: '1px dashed var(--color-border)', transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-secondary)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                        >
                          + Add
                        </div>
                      ) : color ? (
                        <div style={{
                          padding: '8px 10px',
                          background: color + '15',
                          border: `1px solid ${color}40`,
                          borderRadius: '8px',
                          fontSize: '12px', fontWeight: 700, color,
                        }}>
                          {subject}
                        </div>
                      ) : (
                        <div style={{ padding: '8px 10px', background: '#f1f5f9', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                          {subject}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {Object.keys(subjectCount).length > 0 && (
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-title" style={{ marginBottom: '16px' }}>Weekly Load Summary</div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {Object.entries(subjectCount).map(([subj, count]) => {
              const color = SUBJECT_COLORS[subj] || '#6b7280';
              return (
                <div key={subj} style={{ padding: '10px 16px', background: color + '10', border: `1px solid ${color}30`, borderRadius: '10px', textAlign: 'center', minWidth: '100px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color }}>{count}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{subj}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showAdd && (
        <AddPeriodModal
          selectedClass={selectedClass}
          onClose={() => setShowAdd(false)}
          onSave={handleSave}
        />
      )}
      {showClear && (
        <ClearPeriodModal
          selectedClass={selectedClass}
          onClose={() => setShowClear(false)}
          onClear={handleClear}
        />
      )}
    </div>
  );
}
