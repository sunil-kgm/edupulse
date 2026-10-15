import { useState } from 'react';
import { DEMO_COURSES } from '../../data/mockData';
import { FiBook, FiUsers, FiFileText, FiCheckSquare, FiChevronRight, FiArrowLeft, FiCheck } from 'react-icons/fi';

function ProgressBar({ pct }) {
  const color = pct >= 80 ? '#16a34a' : pct >= 60 ? '#f97316' : '#ef4444';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
        <span style={{ color: 'var(--color-text-muted)' }}>Progress</span>
        <span style={{ fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: `linear-gradient(135deg, ${color}, ${color}aa)` }} />
      </div>
    </div>
  );
}

function CourseDetail({ course, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = ['overview', 'modules', 'assignments', 'quizzes'];

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={onBack} className="btn btn-secondary btn-sm">
          <FiArrowLeft size={14} /> Back
        </button>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 700 }}>{course.code}</span>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>{course.name}</h2>
        </div>
      </div>

      {/* Course Info Bar */}
      <div style={{
        display: 'flex', gap: '24px', padding: '16px 20px',
        background: 'var(--color-bg-secondary)', borderRadius: '14px',
        border: '1px solid var(--color-border)', marginBottom: '24px', flexWrap: 'wrap'
      }}>
        {[
          { label: 'Faculty', value: course.faculty.name },
          { label: 'Credits', value: course.credits },
          { label: 'Semester', value: course.semester },
          { label: 'Progress', value: `${course.progress}%` },
          { label: 'Quiz Score', value: course.quizScore ? `${course.quizScore}%` : 'N/A' },
        ].map(i => (
          <div key={i.label}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{i.label}</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{i.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--color-bg-secondary)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{
              padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
              background: activeTab === t ? 'white' : 'transparent',
              color: activeTab === t ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              boxShadow: activeTab === t ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-title" style={{ marginBottom: '16px' }}>About this Course</div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>{course.description}</p>
            <div style={{ marginTop: '20px' }}>
              <ProgressBar pct={course.progress} />
            </div>
          </div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: '16px' }}>Quick Stats</div>
            {[
              { label: 'Total Modules', value: course.totalModules, icon: '📦' },
              { label: 'Completed Modules', value: course.completedModules, icon: '✅' },
              { label: 'Assignments', value: course.assignments, icon: '📝' },
              { label: 'Quiz Score', value: course.quizScore ? `${course.quizScore}%` : 'Not taken', icon: '🎯' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>{s.icon} {s.label}</span>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'modules' && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: '20px' }}>Course Modules</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {course.modules.map((mod, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                background: mod.completed ? '#f0fdf4' : 'var(--color-bg-secondary)',
                border: `1px solid ${mod.completed ? '#bbf7d0' : 'var(--color-border)'}`,
                borderRadius: '12px',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '10px',
                  background: mod.completed ? 'var(--color-primary)' : 'var(--color-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: mod.completed ? 'white' : 'var(--color-text-muted)',
                  fontWeight: 700, fontSize: '14px',
                }}>
                  {mod.completed ? <FiCheck size={16} /> : mod.order}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{mod.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{mod.description}</div>
                </div>
                <span className={`badge ${mod.completed ? 'badge-success' : 'badge-neutral'}`}>
                  {mod.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: '20px' }}>Course Assignments</div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
            This course has {course.assignments} assignments. Go to the Assignments tab for full details and submission.
          </p>
          <div style={{ marginTop: '16px' }}>
            <a href="/assignments" className="btn btn-primary">View All Assignments</a>
          </div>
        </div>
      )}

      {activeTab === 'quizzes' && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: '20px' }}>Quizzes</div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
            Current quiz score for this course: <strong style={{ color: course.quizScore ? 'var(--color-text-primary)' : 'var(--color-error)' }}>
              {course.quizScore ? `${course.quizScore}%` : 'No quiz attempted yet'}
            </strong>
          </p>
          <div style={{ marginTop: '16px' }}>
            <a href="/quizzes" className="btn btn-primary">View All Quizzes</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState(null);

  if (selectedCourse) {
    return <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-title">My Courses</div>
        <div className="page-subtitle">All enrolled courses for Semester 5, Year 3</div>
      </div>

      <div className="grid-2">
        {DEMO_COURSES.map(course => (
          <div
            key={course._id}
            className="course-card"
            onClick={() => setSelectedCourse(course)}
          >
            <div className="course-card-header">
              <div className="course-code">{course.code}</div>
              <div className="course-name">{course.name}</div>
              <div className="course-faculty">👨‍🏫 {course.faculty.name}</div>
            </div>
            <div className="course-card-body">
              <div style={{ marginBottom: '16px' }}>
                <ProgressBar pct={course.progress} />
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>{course.totalModules}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Modules</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>{course.assignments}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Assignments</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: course.quizScore ? (course.quizScore >= 60 ? '#16a34a' : '#ef4444') : 'var(--color-text-muted)' }}>
                    {course.quizScore ? `${course.quizScore}%` : '—'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Quiz Score</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700 }}>{course.credits}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Credits</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {course.completedModules}/{course.totalModules} modules done
                </span>
                <button className="btn btn-primary btn-sm">
                  Open <FiChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
