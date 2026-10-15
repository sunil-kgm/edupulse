import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiX, FiCheck, FiTrash2, FiUser, FiSave } from 'react-icons/fi';

// ── Default departments seeded once ──
const SEED_DEPARTMENTS = [
  { _id: 'd1', name: 'Computer Science & Engineering', code: 'CSE', hod: 'Dr. Meena Sharma', hodEmail: 'hod.cse@edupulse.edu', faculty: 5, students: 280, classes: 6, atRisk: 18, attendance: 81, color: '#3b82f6', estYear: 1985 },
  { _id: 'd2', name: 'Electronics & Communication Engineering', code: 'ECE', hod: 'Dr. Ramesh Kumar', hodEmail: 'hod.ece@edupulse.edu', faculty: 4, students: 240, classes: 5, atRisk: 14, attendance: 79, color: '#7c3aed', estYear: 1987 },
  { _id: 'd3', name: 'Mechanical Engineering', code: 'MECH', hod: 'Dr. Venkat Rao', hodEmail: 'hod.mech@edupulse.edu', faculty: 5, students: 220, classes: 5, atRisk: 22, attendance: 76, color: '#f97316', estYear: 1980 },
  { _id: 'd4', name: 'Civil Engineering', code: 'CIVIL', hod: 'Dr. Sunita Patel', hodEmail: 'hod.civil@edupulse.edu', faculty: 3, students: 180, classes: 4, atRisk: 11, attendance: 83, color: '#16a34a', estYear: 1980 },
  { _id: 'd5', name: 'Information Technology', code: 'IT', hod: 'Dr. Anil Gupta', hodEmail: 'hod.it@edupulse.edu', faculty: 4, students: 200, classes: 4, atRisk: 16, attendance: 80, color: '#0ea5e9', estYear: 1999 },
  { _id: 'd6', name: 'Electrical & Electronics Engineering', code: 'EEE', hod: 'Dr. Kavitha Nair', hodEmail: 'hod.eee@edupulse.edu', faculty: 3, students: 120, classes: 3, atRisk: 8, attendance: 85, color: '#ec4899', estYear: 1983 },
];

const STORAGE_KEY = 'edupulse_departments';
const COLORS = ['#3b82f6', '#7c3aed', '#f97316', '#16a34a', '#0ea5e9', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#6366f1'];

// ── Load from localStorage, seed if first time ──
function loadDepartments() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  // First load: seed defaults and save
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DEPARTMENTS));
  return SEED_DEPARTMENTS;
}

function saveDepartments(depts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(depts));
  } catch {}
}

const EMPTY_FORM = {
  name: '', code: '', hod: '', hodEmail: '', hodPhone: '',
  faculty: 0, students: 0, classes: 0, atRisk: 0, attendance: 80,
  color: '#3b82f6', estYear: new Date().getFullYear(),
  roles: [],
};

// ── Department Modal ──
function DeptModal({ form, setForm, errors, editDept, onSave, onClose }) {
  const [roleInput, setRoleInput] = useState({ name: '', email: '', role: 'faculty' });

  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const addRole = () => {
    if (!roleInput.name || !roleInput.email) return;
    setForm(prev => ({ ...prev, roles: [...(prev.roles || []), { ...roleInput, _id: `r_${Date.now()}` }] }));
    setRoleInput({ name: '', email: '', role: 'faculty' });
  };

  const removeRole = (id) => setForm(prev => ({ ...prev, roles: prev.roles.filter(r => r._id !== id) }));

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflowY: 'auto' }}>
      <div className="animate-slide-up" style={{ background: 'white', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '580px', boxShadow: 'var(--shadow-xl)', maxHeight: '90vh', overflowY: 'auto', margin: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{editDept ? '✏️ Edit Department' : '🏫 Add New Department'}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Basic Info */}
          <div style={{ padding: '16px', background: 'var(--color-bg-secondary)', borderRadius: '12px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '12px', color: 'var(--color-primary)' }}>📋 Basic Information</div>
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Department Name *</label>
              <input className={`form-input ${errors.name ? 'input-error' : ''}`} placeholder="e.g. Computer Science & Engineering" value={form.name} onChange={e => f('name', e.target.value)} />
              {errors.name && <div style={{ fontSize: '12px', color: 'var(--color-error)', marginTop: '4px' }}>{errors.name}</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Department Code *</label>
                <input className={`form-input ${errors.code ? 'input-error' : ''}`} placeholder="e.g. CSE" value={form.code} onChange={e => f('code', e.target.value.toUpperCase())} />
                {errors.code && <div style={{ fontSize: '12px', color: 'var(--color-error)', marginTop: '4px' }}>{errors.code}</div>}
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Established Year</label>
                <input className="form-input" type="number" placeholder="1990" value={form.estYear} onChange={e => f('estYear', e.target.value)} />
              </div>
            </div>
          </div>

          {/* HoD Assignment */}
          <div style={{ padding: '16px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '12px', color: '#1d4ed8' }}>👨‍🏫 Head of Department</div>
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">HoD Name *</label>
              <input className={`form-input ${errors.hod ? 'input-error' : ''}`} placeholder="Dr. Full Name" value={form.hod} onChange={e => f('hod', e.target.value)} />
              {errors.hod && <div style={{ fontSize: '12px', color: 'var(--color-error)', marginTop: '4px' }}>{errors.hod}</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">HoD Email</label>
                <input className="form-input" type="email" placeholder="hod@edupulse.edu" value={form.hodEmail || ''} onChange={e => f('hodEmail', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">HoD Phone</label>
                <input className="form-input" placeholder="+91 9876543210" value={form.hodPhone || ''} onChange={e => f('hodPhone', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Assigned Roles */}
          <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '12px', color: '#15803d' }}>👥 Assign Faculty / Staff Roles</div>
            {(form.roles || []).length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                {form.roles.map(r => (
                  <div key={r._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'white', borderRadius: '10px', border: '1px solid #d1fae5' }}>
                    <div className="avatar avatar-sm" style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: '12px' }}>{r.name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{r.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{r.email} · <span style={{ textTransform: 'capitalize', color: '#7c3aed', fontWeight: 600 }}>{r.role}</span></div>
                    </div>
                    <button onClick={() => removeRole(r._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><FiX size={14} /></button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Name</label>
                <input className="form-input" placeholder="Dr. Name" value={roleInput.name} onChange={e => setRoleInput(r => ({ ...r, name: e.target.value }))} style={{ fontSize: '13px' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Email</label>
                <input className="form-input" placeholder="email@edu.in" value={roleInput.email} onChange={e => setRoleInput(r => ({ ...r, email: e.target.value }))} style={{ fontSize: '13px' }} />
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <select className="form-input" value={roleInput.role} onChange={e => setRoleInput(r => ({ ...r, role: e.target.value }))} style={{ fontSize: '12px', minWidth: '90px' }}>
                  <option value="faculty">Faculty</option>
                  <option value="hod">HoD</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
                <button className="btn btn-primary" style={{ padding: '8px 12px', flexShrink: 0 }} onClick={addRole} disabled={!roleInput.name || !roleInput.email}>
                  <FiPlus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ padding: '16px', background: 'var(--color-bg-secondary)', borderRadius: '12px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '12px', color: 'var(--color-text-secondary)' }}>📊 Department Stats</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '10px' }}>
              {[
                { key: 'faculty', label: 'Faculty', placeholder: '5' },
                { key: 'students', label: 'Students', placeholder: '200' },
                { key: 'classes', label: 'Classes', placeholder: '4' },
                { key: 'atRisk', label: 'At-Risk', placeholder: '10' },
              ].map(field => (
                <div key={field.key} className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{field.label}</label>
                  <input className="form-input" type="number" min="0" placeholder={field.placeholder} value={form[field.key]} onChange={e => f(field.key, Number(e.target.value))} />
                </div>
              ))}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Attendance %</label>
              <input className="form-input" type="number" min="0" max="100" value={form.attendance} onChange={e => f('attendance', Number(e.target.value))} />
            </div>
          </div>

          {/* Color */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Department Color</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              {COLORS.map(c => (
                <div key={c} onClick={() => f('color', c)} style={{ width: 30, height: 30, borderRadius: '8px', background: c, cursor: 'pointer', border: form.color === c ? '3px solid #1f2937' : '2px solid transparent', transition: 'all 0.15s', boxShadow: form.color === c ? `0 0 0 2px ${c}50` : 'none' }} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onSave}>
            <FiSave size={14} /> {editDept ? 'Save Changes' : 'Add Department'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DepartmentsPage() {
  // ── Load from localStorage on mount ──
  const [departments, setDepartments] = useState(() => loadDepartments());
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  // ── Persist to localStorage whenever departments change ──
  useEffect(() => {
    saveDepartments(departments);
  }, [departments]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditDept(null); setErrors({}); setShowModal(true); };
  const openEdit = (dept) => { setForm({ ...EMPTY_FORM, ...dept, roles: dept.roles || [] }); setEditDept(dept); setErrors({}); setShowModal(true); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Department name is required';
    if (!form.code.trim()) e.code = 'Code is required';
    if (!form.hod.trim()) e.hod = 'HoD name is required';
    if (!editDept && departments.find(d => d.code.toLowerCase() === form.code.toLowerCase())) e.code = 'This code already exists';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editDept) {
      setDepartments(prev => prev.map(d => d._id === editDept._id ? { ...d, ...form } : d));
    } else {
      setDepartments(prev => [...prev, { _id: `d_${Date.now()}`, ...form }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setDepartments(prev => prev.filter(d => d._id !== id));
    if (selected === id) setSelected(null);
    setDeleteId(null);
  };

  // ── Detail view ──
  if (selected) {
    const dept = departments.find(d => d._id === selected);
    if (!dept) { setSelected(null); return null; }
    return (
      <div className="animate-fade-in">
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>← Back</button>
          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(dept)}><FiEdit size={12} /> Edit</button>
          <button style={{ padding: '6px 14px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setDeleteId(dept._id)}><FiTrash2 size={12} /> Delete</button>
        </div>

        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '16px', background: dept.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, color: dept.color }}>{dept.code[0]}</div>
            <div>
              <div className="page-title">{dept.name}</div>
              <div className="page-subtitle">Code: {dept.code} · HoD: {dept.hod} · Est. {dept.estYear}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Faculty', value: dept.faculty, color: '#7c3aed', icon: '👨‍🏫' },
            { label: 'Students', value: dept.students, color: '#3b82f6', icon: '👨‍🎓' },
            { label: 'Classes', value: dept.classes, color: '#16a34a', icon: '🏫' },
            { label: 'At-Risk', value: dept.atRisk, color: '#ef4444', icon: '⚠️' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: '26px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ marginBottom: '20px' }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: '16px' }}>Department Details</div>
            {[
              { label: 'Full Name', value: dept.name },
              { label: 'Code', value: dept.code },
              { label: 'Head of Department', value: dept.hod },
              { label: 'HoD Email', value: dept.hodEmail || '—' },
              { label: 'HoD Phone', value: dept.hodPhone || '—' },
              { label: 'Established', value: dept.estYear },
              { label: 'Attendance Rate', value: `${dept.attendance}%` },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{item.label}</span>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Assigned Roles */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: '16px' }}>Assigned Faculty / Staff</div>
            {(dept.roles || []).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                No roles assigned yet.<br />
                <button className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }} onClick={() => openEdit(dept)}>Assign Roles</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dept.roles.map(r => (
                  <div key={r._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'var(--color-bg-secondary)', borderRadius: '10px' }}>
                    <div className="avatar avatar-sm" style={{ background: '#eff6ff', color: '#3b82f6', fontWeight: 700 }}>{r.name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{r.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{r.email}</div>
                    </div>
                    <span style={{ padding: '2px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, background: '#f3e8ff', color: '#7c3aed', textTransform: 'capitalize' }}>{r.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {deleteId && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', width: '360px', textAlign: 'center', boxShadow: 'var(--shadow-xl)' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗑️</div>
              <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>Delete Department?</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>This will permanently remove <strong>{dept.name}</strong>.</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</button>
                <button style={{ flex: 1, padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }} onClick={() => handleDelete(deleteId)}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {showModal && <DeptModal form={form} setForm={setForm} errors={errors} editDept={editDept} onSave={handleSave} onClose={() => setShowModal(false)} />}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Departments</div>
          <div className="page-subtitle">{departments.length} departments · Saved persistently</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus size={14} /> Add Department</button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Depts', value: departments.length, color: '#3b82f6', icon: '🏫' },
          { label: 'Total Faculty', value: departments.reduce((s, d) => s + d.faculty, 0), color: '#7c3aed', icon: '👨‍🏫' },
          { label: 'Total Students', value: departments.reduce((s, d) => s + d.students, 0).toLocaleString(), color: '#16a34a', icon: '👨‍🎓' },
          { label: 'Total At-Risk', value: departments.reduce((s, d) => s + d.atRisk, 0), color: '#ef4444', icon: '⚠️' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '26px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Department Cards */}
      <div className="grid-2">
        {departments.map(dept => (
          <div key={dept._id} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', borderLeft: `4px solid ${dept.color}` }}
            onClick={() => setSelected(dept._id)}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: '2px' }}>{dept.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>HoD: {dept.hod}</div>
                {dept.hodEmail && <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{dept.hodEmail}</div>}
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0, marginLeft: '8px' }}>
                <span style={{ padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: dept.color + '15', color: dept.color }}>{dept.code}</span>
                <button className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }} onClick={e => { e.stopPropagation(); openEdit(dept); }}><FiEdit size={11} /></button>
                <button style={{ padding: '4px 8px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setDeleteId(dept._id); }}><FiTrash2 size={11} /></button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
              {[{ label: 'Faculty', value: dept.faculty }, { label: 'Students', value: dept.students }, { label: 'Classes', value: dept.classes }, { label: 'At-Risk', value: dept.atRisk }].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: dept.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Attendance: {dept.attendance}%</span>
                {(dept.roles || []).length > 0 && <span style={{ color: '#7c3aed', fontWeight: 600 }}>👥 {dept.roles.length} staff</span>}
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${dept.attendance}%`, background: dept.attendance < 80 ? '#f97316' : dept.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && <DeptModal form={form} setForm={setForm} errors={errors} editDept={editDept} onSave={handleSave} onClose={() => setShowModal(false)} />}

      {deleteId && !selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', width: '360px', textAlign: 'center', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗑️</div>
            <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>Delete Department?</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              This will permanently remove <strong>{departments.find(d => d._id === deleteId)?.name}</strong>.
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</button>
              <button style={{ flex: 1, padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }} onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
