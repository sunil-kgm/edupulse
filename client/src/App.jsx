import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

// Layout
import DashboardLayout from './components/DashboardLayout';

// Shared Pages
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import CoursesPage from './pages/student/CoursesPage';
import AssignmentsPage from './pages/student/AssignmentsPage';
import QuizzesPage from './pages/student/QuizzesPage';
import AttendancePage from './pages/student/AttendancePage';
import RecoveryPage from './pages/student/RecoveryPage';
import ResourcesPage from './pages/student/ResourcesPage';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import AtRiskPage from './pages/faculty/AtRiskPage';
import FacultyReportsPage from './pages/faculty/FacultyReportsPage';
import RecoveryMonitorPage from './pages/faculty/RecoveryMonitorPage';
import FacultyAttendancePage from './pages/faculty/FacultyAttendancePage';

// Parent Pages
import ParentDashboard from './pages/parent/ParentDashboard';
import AcademicBacklogPage from './pages/parent/AcademicBacklogPage';
import ParentFacultyReportsPage from './pages/parent/ParentFacultyReportsPage';
import AcknowledgementHistoryPage from './pages/parent/AcknowledgementHistoryPage';
import ParentRecoveryPage from './pages/parent/ParentRecoveryPage';


// HoD Pages
import HoDDashboard from './pages/hod/HoDDashboard';
import FacultyManagementPage from './pages/hod/FacultyManagementPage';
import ClassesPage from './pages/hod/ClassesPage';
import TimetablePage from './pages/hod/TimetablePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import RolesPage from './pages/admin/RolesPage';
import RiskConfigPage from './pages/admin/RiskConfigPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';

// Shared Pages
import AnalyticsPage from './pages/AnalyticsPage';

// ──────────────────────────────────────────
// Protected Route — redirects if not logged in
// ──────────────────────────────────────────
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', flexDirection: 'column', gap: '16px',
      }}>
        <div style={{
          width: 44, height: 44, background: 'linear-gradient(135deg, #16a34a, #22c55e)',
          borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
            <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="loading-spinner" style={{ width: 28, height: 28 }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// ──────────────────────────────────────────
// Role-based Dashboard Redirect
// ──────────────────────────────────────────
function DashboardRedirect() {
  const { user } = useAuth();
  const dashboardMap = {
    student: <StudentDashboard />,
    faculty: <FacultyDashboard />,
    parent: <ParentDashboard />,
    hod: <HoDDashboard />,
    admin: <AdminDashboard />,
  };
  return dashboardMap[user?.role] || <StudentDashboard />;
}

// ──────────────────────────────────────────
// Placeholder for unbuilt secondary pages
// ──────────────────────────────────────────
function PlaceholderPage({ title }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 40px' }}>
      <div style={{ fontSize: '56px', marginBottom: '20px' }}>🚧</div>
      <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>{title}</div>
      <div style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
        This page is available in the full backend-connected version.
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// Main App Router
// ──────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* ── Universal ── */}
        <Route path="dashboard" element={<DashboardRedirect />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />

        {/* ── Student ── */}
        <Route path="courses" element={<CoursesPage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="quizzes" element={<QuizzesPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="recovery" element={<RecoveryPage />} />
        <Route path="resources" element={<ResourcesPage />} />

        {/* ── Faculty ── */}
        <Route path="at-risk" element={<AtRiskPage />} />
        <Route path="reports" element={<FacultyReportsPage />} />
        <Route path="recovery-monitor" element={<RecoveryMonitorPage />} />
        <Route path="mark-attendance" element={<FacultyAttendancePage />} />

        {/* ── Parent ── */}
        <Route path="academic-backlog" element={<AcademicBacklogPage />} />
        <Route path="faculty-reports" element={<ParentFacultyReportsPage />} />
        <Route path="acknowledgement-history" element={<AcknowledgementHistoryPage />} />
        <Route path="recovery-progress" element={<ParentRecoveryPage />} />

        {/* ── HoD ── */}
        <Route path="faculty" element={<FacultyManagementPage />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="timetable" element={<TimetablePage />} />

        {/* ── Admin ── */}
        <Route path="users" element={<UsersPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="risk-config" element={<RiskConfigPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />

        {/* ── Shared Analytics ── */}
        <Route path="analytics" element={<AnalyticsPage />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Global catch */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
