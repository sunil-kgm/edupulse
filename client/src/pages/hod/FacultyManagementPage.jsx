import { useState } from 'react';
import { FiPlus, FiX, FiEdit, FiSearch } from 'react-icons/fi';

const INITIAL_FACULTY = [
  { _id: 'f1', name: 'Dr. Priya Nair', email: 'faculty@edupulse.edu', department: 'CSE', specialization: 'Data Structures & Algorithms', courses: 2, students: 62, status: 'active' },
  { _id: 'f2', name: 'Prof. Rajesh Iyer', email: 'faculty2@edupulse.edu', department: 'CSE', specialization: 'Computer Networks', courses: 2, students: 58, status: 'active' },
  { _id: 'f3', name: 'Dr. Anitha Krishnan', email: 'faculty3@edupulse.edu', department: 'CSE', specialization: 'Database Management', courses: 1, students: 60, status: 'active' },
  { _id: 'f4', name: 'Dr. Suresh Babu', email: 'faculty4@edupulse.edu', department: 'CSE', specialization: 'Machine Learning', courses: 2, students: 55, status: 'active' },
  { _id: 'f5', name: 'Mrs. Lakshmi Devi', email: 'faculty5@edupulse.edu', department: 'CSE', specialization: 'Operating Systems', courses: 1, students: 60, status: 'on-leave' },
];

function AddFacultyModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', email: '', specialization: '', status: 'active' });
  const [saving, setSaving] = useState(false);

  const handle = () => {
    if (!form.name || !form.email) return;
    setSaving(true);
    setTimeout(() => {
      onAdd({
        _id: `f_${Date.now()}`,
        name: form.name,
        email: form.email,
        department: 'CSE',
        specialization: form.specialization,
        courses: 0,
        students: 0,
        status: form.status,
      });
      onClose();
    }, 900);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container animate-slide-up">
        <div className="modal-header">
          <div className="modal-title">Add New Faculty Member</div>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" placeholder="e.g. Dr. Ramesh Kumar" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input className="form-input" type="email" placeholder="e.g. ramesh@edupulse.edu" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Specialization</label>
            <input className="form-input" placeholder="e.g. Artificial Intelligence" value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
          <div style={{ background: 'var(--color-bg-secondary)', borderRadius: '10px', padding: '12px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
            💡 The faculty member will receive their login credentials via email once added.
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handle} disabled={!form.name || !form.email || saving}>
            {saving ? 'Adding...' : <><FiPlus size={14} /> Add Faculty</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditFacultyModal({ faculty, onClose, onSave }) {
  const [form, setForm] = useState({ name: faculty.name, email: faculty.email, specialization: faculty.specialization || '', status: faculty.status });
  const [saving, setSaving] = useState(false);

  const handle = () => {
    setSaving(true);
    setTimeout(() => { onSave({ ...faculty, ...form }); onClose(); }, 800);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container animate-slide-up">
        <div className="modal-header">
          <div className="modal-title">Edit Faculty — {faculty.name}</div>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Specialization</label>
            <input className="form-input" value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="active">Active</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handle} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
}

export default function FacultyManagementPage() {
  const [faculty, setFaculty] = useState(INITIAL_FACULTY);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = faculty.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (newFaculty) => setFaculty(prev => [...prev, newFaculty]);
  const handleSave = (updated) => setFaculty(prev => prev.map(f => f._id === updated._id ? updated : f));

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Faculty Management</div>
          <div className="page-subtitle">{faculty.length} faculty members in CSE Department</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <FiPlus size={14} /> Add Faculty
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Faculty', value: faculty.length, color: '#3b82f6', icon: '👨‍🏫' },
          { label: 'Active', value: faculty.filter(f => f.status === 'active').length, color: '#16a34a', icon: '✅' },
          { label: 'On Leave', value: faculty.filter(f => f.status === 'on-leave').length, color: '#f97316', icon: '🏖️' },
          { label: 'Total Courses', value: faculty.reduce((s, f) => s + (f.courses || 0), 0), color: '#7c3aed', icon: '📚' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '400px' }}>
        <FiSearch size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <input className="form-input" style={{ paddingLeft: '40px' }} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Faculty Member</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Courses</th>
                <th>Students</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar avatar-sm" style={{ background: '#eff6ff', color: '#3b82f6', fontWeight: 700 }}>{f.name[0]}</div>
                      <div style={{ fontWeight: 600 }}>{f.name}</div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>{f.email}</td>
                  <td style={{ fontSize: '13px' }}>{f.specialization || '—'}</td>
                  <td><span className="badge badge-info">{f.courses || 0} Courses</span></td>
                  <td style={{ fontWeight: 600 }}>{f.students || 0}</td>
                  <td>
                    <span className={`badge ${f.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {f.status === 'active' ? '● Active' : '● On Leave'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditing(f)}>
                      <FiEdit size={12} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && <AddFacultyModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
      {editing && <EditFacultyModal faculty={editing} onClose={() => setEditing(null)} onSave={handleSave} />}
    </div>
  );
}
