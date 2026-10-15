import { useState } from 'react';
import { FiPlus, FiX, FiEdit2 } from 'react-icons/fi';

const INITIAL_CLASSES = [
  { _id: 'c1', name: 'I CSE - A', year: 1, semester: 1, students: 60, classTeacher: 'Dr. Suresh Babu', courses: ['Engineering Mathematics', 'Programming in C', 'Physics', 'English'], attendance: 88 },
  { _id: 'c2', name: 'I CSE - B', year: 1, semester: 1, students: 58, classTeacher: 'Mrs. Lakshmi Devi', courses: ['Engineering Mathematics', 'Programming in C', 'Physics', 'English'], attendance: 85 },
  { _id: 'c3', name: 'II CSE - A', year: 2, semester: 3, students: 55, classTeacher: 'Prof. Rajesh Iyer', courses: ['Data Structures', 'Digital Electronics', 'Discrete Math'], attendance: 82 },
  { _id: 'c4', name: 'III CSE - A', year: 3, semester: 5, students: 52, classTeacher: 'Dr. Priya Nair', courses: ['Database Management', 'Operating Systems', 'Computer Networks'], attendance: 79 },
  { _id: 'c5', name: 'III CSE - B', year: 3, semester: 5, students: 50, classTeacher: 'Dr. Anitha Krishnan', courses: ['Database Management', 'Operating Systems', 'Computer Networks'], attendance: 76 },
  { _id: 'c6', name: 'IV CSE - A', year: 4, semester: 7, students: 48, classTeacher: 'Dr. Suresh Babu', courses: ['Machine Learning', 'Cloud Computing', 'Project'], attendance: 83 },
];

const FACULTY_OPTIONS = ['Dr. Priya Nair', 'Prof. Rajesh Iyer', 'Dr. Anitha Krishnan', 'Dr. Suresh Babu', 'Mrs. Lakshmi Devi'];

function AddClassModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', year: '1', semester: '1', classTeacher: '', coursesText: '' });
  const [saving, setSaving] = useState(false);

  const handle = () => {
    if (!form.name || !form.classTeacher) return;
    setSaving(true);
    setTimeout(() => {
      onAdd({
        _id: `c_${Date.now()}`,
        name: form.name,
        year: Number(form.year),
        semester: Number(form.semester),
        classTeacher: form.classTeacher,
        students: 0,
        courses: form.coursesText.split(',').map(c => c.trim()).filter(Boolean),
        attendance: 0,
      });
      onClose();
    }, 900);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container animate-slide-up">
        <div className="modal-header">
          <div className="modal-title">Add New Class</div>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Class Name *</label>
            <input className="form-input" placeholder="e.g. II CSE - B" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Year</label>
              <select className="form-input" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}>
                {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Semester</label>
              <select className="form-input" value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Class Teacher *</label>
            <select className="form-input" value={form.classTeacher} onChange={e => setForm(f => ({ ...f, classTeacher: e.target.value }))}>
              <option value="">Select faculty...</option>
              {FACULTY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Courses (comma separated)</label>
            <textarea className="form-textarea" rows={3} placeholder="e.g. Data Structures, DBMS, Operating Systems" value={form.coursesText} onChange={e => setForm(f => ({ ...f, coursesText: e.target.value }))} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handle} disabled={!form.name || !form.classTeacher || saving}>
            {saving ? 'Adding...' : <><FiPlus size={14} /> Add Class</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function ClassDetailView({ cls, onBack }) {
  return (
    <div className="animate-fade-in">
      <button className="btn btn-secondary btn-sm" onClick={onBack} style={{ marginBottom: '20px' }}>← Back to Classes</button>
      <div className="page-header">
        <div className="page-title">{cls.name}</div>
        <div className="page-subtitle">Year {cls.year} · Semester {cls.semester} · Class Teacher: {cls.classTeacher}</div>
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>Class Information</div>
          {[
            { label: 'Class Name', value: cls.name },
            { label: 'Year', value: `Year ${cls.year}` },
            { label: 'Semester', value: `Semester ${cls.semester}` },
            { label: 'Class Teacher', value: cls.classTeacher },
            { label: 'Total Students', value: cls.students },
            { label: 'Avg. Attendance', value: `${cls.attendance}%` },
          ].map(f => (
            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border-light)' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{f.label}</span>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{f.value}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>Courses Offered ({cls.courses.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {cls.courses.length === 0
              ? <div style={{ color: 'var(--color-text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No courses assigned yet.</div>
              : cls.courses.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--color-bg-secondary)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '18px' }}>📚</span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{c}</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClassesPage() {
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  if (selected) {
    const cls = classes.find(c => c._id === selected);
    return <ClassDetailView cls={cls} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Classes</div>
          <div className="page-subtitle">{classes.length} classes in CSE Department</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <FiPlus size={14} /> Add Class
        </button>
      </div>

      <div className="grid-2">
        {classes.map(cls => (
          <div key={cls._id} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => setSelected(cls._id)}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>{cls.name}</div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>Year {cls.year} · Semester {cls.semester}</div>
              </div>
              <span className={`badge ${cls.attendance >= 80 ? 'badge-success' : cls.attendance === 0 ? 'badge-info' : 'badge-warning'}`}>
                {cls.attendance === 0 ? 'New' : `${cls.attendance}% Att.`}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#3b82f6', fontFamily: "'Space Grotesk',sans-serif" }}>{cls.students}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Students</div>
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#7c3aed', fontFamily: "'Space Grotesk',sans-serif" }}>{cls.courses.length}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Courses</div>
              </div>
            </div>

            {cls.attendance > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Attendance</div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${cls.attendance}%`, background: cls.attendance >= 80 ? 'var(--color-primary)' : '#f97316' }} />
                </div>
              </div>
            )}
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>👨‍🏫 {cls.classTeacher}</div>
          </div>
        ))}
      </div>

      {showAdd && (
        <AddClassModal
          onClose={() => setShowAdd(false)}
          onAdd={cls => { setClasses(prev => [...prev, cls]); }}
        />
      )}
    </div>
  );
}
