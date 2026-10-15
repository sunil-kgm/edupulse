import { useState } from 'react';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiX, FiCheck, FiMail, FiUser, FiLock } from 'react-icons/fi';

const INITIAL_USERS = [
  // Admin
  { _id: 'u1', name: 'Dr. Admin Kumar', email: 'admin@edupulse.edu', role: 'admin', department: 'All', status: 'active', joined: '2024-01-01' },
  // HoDs
  { _id: 'u2', name: 'Dr. Meena Sharma', email: 'hod@edupulse.edu', role: 'hod', department: 'CSE', status: 'active', joined: '2024-01-05' },
  { _id: 'u3', name: 'Dr. Ramesh Kumar', email: 'hod.ece@edupulse.edu', role: 'hod', department: 'ECE', status: 'active', joined: '2024-01-05' },
  { _id: 'u4', name: 'Dr. Venkat Rao', email: 'hod.mech@edupulse.edu', role: 'hod', department: 'MECH', status: 'active', joined: '2024-01-06' },
  { _id: 'u5', name: 'Dr. Sunita Patel', email: 'hod.civil@edupulse.edu', role: 'hod', department: 'CIVIL', status: 'active', joined: '2024-01-06' },
  { _id: 'u6', name: 'Dr. Anil Gupta', email: 'hod.it@edupulse.edu', role: 'hod', department: 'IT', status: 'active', joined: '2024-01-07' },
  // CSE Faculty
  { _id: 'u7', name: 'Dr. Priya Nair', email: 'faculty@edupulse.edu', role: 'faculty', department: 'CSE', status: 'active', joined: '2024-01-10' },
  { _id: 'u8', name: 'Prof. Rajesh Iyer', email: 'faculty2@edupulse.edu', role: 'faculty', department: 'CSE', status: 'active', joined: '2024-01-10' },
  { _id: 'u9', name: 'Dr. Anitha Krishnan', email: 'faculty3@edupulse.edu', role: 'faculty', department: 'CSE', status: 'active', joined: '2024-01-12' },
  { _id: 'u10', name: 'Mrs. Lakshmi Devi', email: 'faculty4@edupulse.edu', role: 'faculty', department: 'CSE', status: 'on-leave', joined: '2024-01-15' },
  // ECE Faculty
  { _id: 'u11', name: 'Dr. Kiran Babu', email: 'faculty.ece1@edupulse.edu', role: 'faculty', department: 'ECE', status: 'active', joined: '2024-01-10' },
  { _id: 'u12', name: 'Prof. Divya Menon', email: 'faculty.ece2@edupulse.edu', role: 'faculty', department: 'ECE', status: 'active', joined: '2024-01-12' },
  // MECH Faculty
  { _id: 'u13', name: 'Dr. Suresh Babu', email: 'faculty.mech1@edupulse.edu', role: 'faculty', department: 'MECH', status: 'active', joined: '2024-01-10' },
  { _id: 'u14', name: 'Prof. Nanda Kumar', email: 'faculty.mech2@edupulse.edu', role: 'faculty', department: 'MECH', status: 'active', joined: '2024-01-13' },
  // IT Faculty
  { _id: 'u15', name: 'Dr. Ravi Shankar', email: 'faculty.it1@edupulse.edu', role: 'faculty', department: 'IT', status: 'active', joined: '2024-01-10' },
  // CSE Students
  { _id: 'u16', name: 'Arun Kumar', email: 'student@edupulse.edu', role: 'student', department: 'CSE', status: 'active', joined: '2024-06-01' },
  { _id: 'u17', name: 'Priya Lakshmi', email: 'student2@edupulse.edu', role: 'student', department: 'CSE', status: 'active', joined: '2024-06-01' },
  { _id: 'u18', name: 'Vikram Rajan', email: 'student3@edupulse.edu', role: 'student', department: 'CSE', status: 'active', joined: '2024-06-01' },
  { _id: 'u19', name: 'Sneha Pillai', email: 'student4@edupulse.edu', role: 'student', department: 'CSE', status: 'active', joined: '2024-06-01' },
  // ECE Students
  { _id: 'u20', name: 'Rahul Singh', email: 'student.ece1@edupulse.edu', role: 'student', department: 'ECE', status: 'active', joined: '2024-06-01' },
  { _id: 'u21', name: 'Anjali Verma', email: 'student.ece2@edupulse.edu', role: 'student', department: 'ECE', status: 'active', joined: '2024-06-01' },
  // MECH Students
  { _id: 'u22', name: 'Arjun Mehta', email: 'student.mech1@edupulse.edu', role: 'student', department: 'MECH', status: 'active', joined: '2024-06-01' },
  { _id: 'u23', name: 'Deepak Yadav', email: 'student.mech2@edupulse.edu', role: 'student', department: 'MECH', status: 'active', joined: '2024-06-01' },
  // IT Students
  { _id: 'u24', name: 'Kavya Nair', email: 'student.it1@edupulse.edu', role: 'student', department: 'IT', status: 'active', joined: '2024-06-01' },
  // CIVIL Students
  { _id: 'u25', name: 'Ramesh Babu', email: 'student.civil1@edupulse.edu', role: 'student', department: 'CIVIL', status: 'active', joined: '2024-06-01' },
  // Parents
  { _id: 'u26', name: 'Mr. Suresh Kumar', email: 'parent@edupulse.edu', role: 'parent', department: '—', status: 'active', joined: '2024-06-05' },
  { _id: 'u27', name: 'Mrs. Anitha Raj', email: 'parent2@edupulse.edu', role: 'parent', department: '—', status: 'active', joined: '2024-06-05' },
  { _id: 'u28', name: 'Mr. Krishnan V', email: 'parent3@edupulse.edu', role: 'parent', department: '—', status: 'active', joined: '2024-06-05' },
];

const DEPARTMENTS = ['All', 'CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'EEE'];
const ROLE_COLORS = { admin: '#7c3aed', hod: '#0ea5e9', faculty: '#16a34a', student: '#f97316', parent: '#ec4899' };
const ROLE_ICONS = { admin: '🛡️', hod: '🎓', faculty: '👨‍🏫', student: '📚', parent: '👨‍👩‍👧' };

const EMPTY_FORM = { name: '', email: '', role: 'student', department: 'CSE', status: 'active', password: '' };

export default function UsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchDept = deptFilter === 'all' || u.department === deptFilter;
    return matchSearch && matchRole && matchDept;
  });

  const counts = users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {});

  const openAdd = () => { setForm(EMPTY_FORM); setEditUser(null); setErrors({}); setShowModal(true); };
  const openEdit = (u) => { setForm({ name: u.name, email: u.email, role: u.role, department: u.department, status: u.status, password: '' }); setEditUser(u); setErrors({}); setShowModal(true); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!editUser && !form.password.trim()) e.password = 'Password required for new user';
    if (!editUser && users.find(u => u.email === form.email)) e.email = 'Email already exists';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const today = new Date().toISOString().slice(0, 10);
    if (editUser) {
      setUsers(prev => prev.map(u => u._id === editUser._id ? { ...u, ...form } : u));
    } else {
      const newUser = { _id: `u${Date.now()}`, ...form, joined: today };
      setUsers(prev => [...prev, newUser]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setUsers(prev => prev.filter(u => u._id !== id));
    setDeleteId(null);
  };

  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">User Management</div>
            <div className="page-subtitle">{users.length} total users · {filtered.length} shown</div>
          </div>
          <button className="btn btn-primary" onClick={openAdd}><FiPlus size={14} /> Add User</button>
        </div>
      </div>

      {/* Role Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {['admin', 'hod', 'faculty', 'student', 'parent'].map(role => (
          <div key={role} className="stat-card"
            style={{ cursor: 'pointer', border: roleFilter === role ? `2px solid ${ROLE_COLORS[role]}` : '1px solid var(--color-border)', transition: 'all 0.2s' }}
            onClick={() => setRoleFilter(roleFilter === role ? 'all' : role)}
          >
            <div style={{ fontSize: '26px', marginBottom: '6px' }}>{ROLE_ICONS[role]}</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: ROLE_COLORS[role], fontFamily: "'Space Grotesk',sans-serif" }}>{counts[role] || 0}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'capitalize', marginTop: '3px' }}>{role}s</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px', maxWidth: '360px' }}>
          <FiSearch size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input className="form-input" style={{ paddingLeft: '40px' }} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: 'auto' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          {['admin','hod','faculty','student','parent'].map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
        </select>
        <select className="form-select" style={{ width: 'auto' }} value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
          <option value="all">All Depts</option>
          {DEPARTMENTS.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Joined</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="avatar avatar-sm" style={{ background: ROLE_COLORS[u.role] + '15', color: ROLE_COLORS[u.role], fontWeight: 700 }}>{u.name[0]}</div>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>{u.email}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, background: ROLE_COLORS[u.role] + '15', color: ROLE_COLORS[u.role] }}>
                      {ROLE_ICONS[u.role]} {u.role}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{u.department}</td>
                  <td>
                    <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      ● {u.status === 'active' ? 'Active' : 'On Leave'}
                    </span>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{u.joined}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u)}><FiEdit size={12} /> Edit</button>
                      <button className="btn btn-danger btn-sm" style={{ padding: '4px 10px' }} onClick={() => setDeleteId(u._id)}><FiTrash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="animate-slide-up" style={{ background: 'white', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>{editUser ? 'Edit User' : 'Add New User'}</div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><FiX size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Name */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name *</label>
                <input className={`form-input ${errors.name ? 'input-error' : ''}`} placeholder="Dr. John Smith" value={form.name} onChange={e => f('name', e.target.value)} />
                {errors.name && <div style={{ fontSize: '12px', color: 'var(--color-error)', marginTop: '4px' }}>{errors.name}</div>}
              </div>

              {/* Email */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address *</label>
                <input className={`form-input ${errors.email ? 'input-error' : ''}`} type="email" placeholder="name@edupulse.edu" value={form.email} onChange={e => f('email', e.target.value)} />
                {errors.email && <div style={{ fontSize: '12px', color: 'var(--color-error)', marginTop: '4px' }}>{errors.email}</div>}
              </div>

              {/* Role + Dept row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Role *</label>
                  <select className="form-select" value={form.role} onChange={e => f('role', e.target.value)}>
                    {['admin','hod','faculty','student','parent'].map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Department *</label>
                  <select className="form-select" value={form.department} onChange={e => f('department', e.target.value)}>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => f('status', e.target.value)}>
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Password — only for new users */}
              {!editUser && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Password *</label>
                  <input className={`form-input ${errors.password ? 'input-error' : ''}`} type="password" placeholder="Set initial password" value={form.password} onChange={e => f('password', e.target.value)} />
                  {errors.password && <div style={{ fontSize: '12px', color: 'var(--color-error)', marginTop: '4px' }}>{errors.password}</div>}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>
                <FiCheck size={14} /> {editUser ? 'Save Changes' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '360px', boxShadow: 'var(--shadow-xl)', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗑️</div>
            <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>Delete User?</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>This action cannot be undone.</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
