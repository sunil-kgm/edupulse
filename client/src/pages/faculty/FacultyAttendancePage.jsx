import { useState } from 'react';
import { FiCheck, FiX, FiClock, FiSave, FiCheckCircle, FiCalendar, FiUsers } from 'react-icons/fi';

// ── Mock data ─────────────────────────────────────────────────────────────
const FACULTY_COURSES = [
  { id: 'cs301', code: 'CS301', name: 'Data Structures', class: 'III CSE - A' },
  { id: 'cs302', code: 'CS302', name: 'Database Management', class: 'III CSE - A' },
  { id: 'cs303', code: 'CS303', name: 'Computer Networks', class: 'III CSE - B' },
  { id: 'cs304', code: 'CS304', name: 'Operating Systems', class: 'III CSE - B' },
];

const STUDENTS_BY_COURSE = {
  cs301: [
    { _id: 's1',  name: 'Arun Kumar',      rollNumber: 'CB21CS001' },
    { _id: 's2',  name: 'Bhavana Reddy',   rollNumber: 'CB21CS002' },
    { _id: 's3',  name: 'Chetan Sharma',   rollNumber: 'CB21CS003' },
    { _id: 's4',  name: 'Divya Menon',     rollNumber: 'CB21CS004' },
    { _id: 's5',  name: 'Elan Selvam',     rollNumber: 'CB21CS005' },
    { _id: 's6',  name: 'Fathima Noor',    rollNumber: 'CB21CS006' },
    { _id: 's7',  name: 'Ganesh Pillai',   rollNumber: 'CB21CS007' },
    { _id: 's8',  name: 'Harini Suresh',   rollNumber: 'CB21CS008' },
    { _id: 's9',  name: 'Ishaan Verma',    rollNumber: 'CB21CS009' },
    { _id: 's10', name: 'Jaya Priya',      rollNumber: 'CB21CS010' },
  ],
  cs302: [
    { _id: 's1',  name: 'Arun Kumar',      rollNumber: 'CB21CS001' },
    { _id: 's2',  name: 'Bhavana Reddy',   rollNumber: 'CB21CS002' },
    { _id: 's3',  name: 'Chetan Sharma',   rollNumber: 'CB21CS003' },
    { _id: 's11', name: 'Kavitha Nair',    rollNumber: 'CB21CS011' },
    { _id: 's12', name: 'Lokesh Rajan',    rollNumber: 'CB21CS012' },
  ],
  cs303: [
    { _id: 's13', name: 'Meena Sundaram',  rollNumber: 'CB21CS013' },
    { _id: 's14', name: 'Naveen Raj',      rollNumber: 'CB21CS014' },
    { _id: 's15', name: 'Oviya Prabhu',    rollNumber: 'CB21CS015' },
    { _id: 's16', name: 'Pranav Mohan',    rollNumber: 'CB21CS016' },
    { _id: 's17', name: 'Ramya Selvi',     rollNumber: 'CB21CS017' },
  ],
  cs304: [
    { _id: 's13', name: 'Meena Sundaram',  rollNumber: 'CB21CS013' },
    { _id: 's14', name: 'Naveen Raj',      rollNumber: 'CB21CS014' },
    { _id: 's18', name: 'Sujith Kumar',    rollNumber: 'CB21CS018' },
    { _id: 's19', name: 'Thenmozhi R.',    rollNumber: 'CB21CS019' },
    { _id: 's20', name: 'Udhaya Kumar',    rollNumber: 'CB21CS020' },
    { _id: 's21', name: 'Varsha Menon',    rollNumber: 'CB21CS021' },
  ],
};

const STATUS_CONFIG = {
  present: { label: 'Present', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  absent:  { label: 'Absent',  color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  late:    { label: 'Late',    color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function SavedToast({ onDismiss }) {
  return (
    <div style={{
      position: 'fixed', bottom: 32, right: 32, zIndex: 9999,
      background: '#16a34a', color: 'white', borderRadius: '14px',
      padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '10px',
      boxShadow: '0 8px 32px rgba(22,163,74,0.35)',
    }}>
      <FiCheckCircle size={20} />
      <div>
        <div style={{ fontWeight: 700, fontSize: '14px' }}>Attendance Saved!</div>
        <div style={{ fontSize: '12px', opacity: 0.85 }}>Records submitted successfully.</div>
      </div>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginLeft: '8px' }}>
        <FiX size={16} />
      </button>
    </div>
  );
}

export default function FacultyAttendancePage() {
  const [selectedCourse, setSelectedCourse] = useState(FACULTY_COURSES[0].id);
  const [date, setDate] = useState(todayStr());
  const [attendance, setAttendance] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const course = FACULTY_COURSES.find(c => c.id === selectedCourse);
  const students = STUDENTS_BY_COURSE[selectedCourse] || [];

  const handleCourseChange = (id) => { setSelectedCourse(id); setAttendance({}); setSaved(false); };
  const handleDateChange   = (d)  => { setDate(d); setAttendance({}); setSaved(false); };
  const setStatus = (studentId, status) => setAttendance(prev => ({ ...prev, [studentId]: status }));
  const markAll   = (status) => { const all = {}; students.forEach(s => { all[s._id] = status; }); setAttendance(all); };

  const presentCount = students.filter(s => attendance[s._id] === 'present').length;
  const absentCount  = students.filter(s => attendance[s._id] === 'absent').length;
  const lateCount    = students.filter(s => attendance[s._id] === 'late').length;
  const markedCount  = students.filter(s => attendance[s._id]).length;
  const totalCount   = students.length;

  const handleSave = () => {
    if (markedCount < totalCount) return;
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); }, 900);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Mark Attendance</div>
          <div className="page-subtitle">Record student attendance for your courses</div>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={markedCount < totalCount || saving}>
          {saving
            ? <><div className="loading-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving…</>
            : <><FiSave size={14} /> Save Attendance</>}
        </button>
      </div>

      {/* Course & Date Selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiUsers size={18} color="#3b82f6" />
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)' }}>Select Course</div>
          </div>
          <select className="form-input" value={selectedCourse} onChange={e => handleCourseChange(e.target.value)}>
            {FACULTY_COURSES.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.class})</option>
            ))}
          </select>
          <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            📌 {course?.code} · {course?.class} · {totalCount} students enrolled
          </div>
        </div>

        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiCalendar size={18} color="#f97316" />
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)' }}>Session Date</div>
          </div>
          <input type="date" className="form-input" value={date} max={todayStr()} onChange={e => handleDateChange(e.target.value)} />
          <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            📅 {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {[
          { label: 'Total Students', value: totalCount,    color: '#3b82f6', bg: '#eff6ff', icon: '👥' },
          { label: 'Present',        value: presentCount,  color: '#16a34a', bg: '#f0fdf4', icon: '✅' },
          { label: 'Absent',         value: absentCount,   color: '#ef4444', bg: '#fef2f2', icon: '❌' },
          { label: 'Late',           value: lateCount,     color: '#f97316', bg: '#fff7ed', icon: '⏰' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ background: s.bg }}>
            <div style={{ fontSize: '26px', marginBottom: '6px' }}>{s.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--color-text-muted)' }}>
          <span>Marking Progress</span>
          <span>{markedCount} / {totalCount} marked</span>
        </div>
        <div className="progress-bar-container" style={{ height: '8px' }}>
          <div className="progress-bar-fill" style={{
            width: `${totalCount ? (markedCount / totalCount) * 100 : 0}%`,
            background: markedCount === totalCount ? '#16a34a' : 'var(--color-primary)',
          }} />
        </div>
        {markedCount < totalCount && (
          <div style={{ fontSize: '12px', color: '#f97316', marginTop: '6px', fontWeight: 600 }}>
            ⚠ Mark all {totalCount - markedCount} remaining student(s) before saving.
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Mark All As:</span>
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
          <button key={status} onClick={() => markAll(status)} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
            border: `1.5px solid ${cfg.border}`, background: cfg.bg, color: cfg.color,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 4px 12px ${cfg.color}25`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {status === 'present' && <FiCheck size={13} />}
            {status === 'absent'  && <FiX size={13} />}
            {status === 'late'    && <FiClock size={13} />}
            {cfg.label}
          </button>
        ))}
        <button onClick={() => setAttendance({})} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
          border: '1.5px solid var(--color-border)', background: 'var(--color-bg-secondary)',
          color: 'var(--color-text-muted)', cursor: 'pointer',
        }}>
          <FiX size={13} /> Clear All
        </button>
      </div>

      {/* Student Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="card-title">{course?.name} — Student Roll</div>
            <div className="card-subtitle">{course?.class} · Session: {date}</div>
          </div>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Mark</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => {
                const status = attendance[student._id];
                const cfg = status ? STATUS_CONFIG[status] : null;
                return (
                  <tr key={student._id} style={{ background: cfg ? cfg.bg + '88' : 'white', transition: 'background 0.2s' }}>
                    <td style={{ color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '13px' }}>{idx + 1}</td>
                    <td>
                      <span className="badge badge-info" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>
                        {student.rollNumber}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar avatar-sm" style={{
                          background: cfg ? cfg.bg : 'var(--color-bg-secondary)',
                          color: cfg ? cfg.color : 'var(--color-text-muted)',
                          border: cfg ? `1.5px solid ${cfg.border}` : '1.5px solid var(--color-border)',
                        }}>
                          {student.name[0]}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>{student.name}</span>
                      </div>
                    </td>
                    <td>
                      {status ? (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                          background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                        }}>
                          {status === 'present' && <FiCheck size={12} />}
                          {status === 'absent'  && <FiX size={12} />}
                          {status === 'late'    && <FiClock size={12} />}
                          {cfg.label}
                        </span>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Not marked</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        {Object.entries(STATUS_CONFIG).map(([s, c]) => (
                          <button key={s} onClick={() => setStatus(student._id, s)} title={c.label} style={{
                            width: 34, height: 34, borderRadius: '8px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: status === s ? `2px solid ${c.color}` : '1.5px solid var(--color-border)',
                            background: status === s ? c.bg : 'white',
                            color: status === s ? c.color : 'var(--color-text-muted)',
                            transition: 'all 0.15s',
                            transform: status === s ? 'scale(1.12)' : 'scale(1)',
                            boxShadow: status === s ? `0 2px 8px ${c.color}30` : 'none',
                          }}>
                            {s === 'present' && <FiCheck size={14} />}
                            {s === 'absent'  && <FiX size={14} />}
                            {s === 'late'    && <FiClock size={14} />}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-secondary)' }}>
          <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            {markedCount === totalCount
              ? <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ All {totalCount} students marked — ready to save</span>
              : `${totalCount - markedCount} student(s) not yet marked`}
          </div>
          <button className="btn btn-primary" onClick={handleSave} disabled={markedCount < totalCount || saving}>
            {saving ? 'Saving…' : <><FiSave size={14} /> Save Attendance</>}
          </button>
        </div>
      </div>

      {saved && <SavedToast onDismiss={() => setSaved(false)} />}
    </div>
  );
}
