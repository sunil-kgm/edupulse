import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE, timeout: 8000 });

// Attach JWT token to every request (skip demo tokens)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('edupulse_token');
  if (token && !token.startsWith('demo_token_')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Health ──────────────────────────────────
export const healthCheck = () => api.get('/health');

// ── Auth ─────────────────────────────────────
export const loginAPI   = (email, password) => api.post('/auth/login', { email, password });
export const getMeAPI   = () => api.get('/auth/me');

// ── Users ────────────────────────────────────
export const getAllUsers  = (params) => api.get('/users', { params });
export const getUserById  = (id)     => api.get(`/users/${id}`);
export const createUser   = (data)   => api.post('/users', data);
export const updateUser   = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser   = (id)     => api.delete(`/users/${id}`);

// ── Courses ───────────────────────────────────
export const getCourses    = (params) => api.get('/courses', { params });
export const getCourseById = (id)     => api.get(`/courses/${id}`);
export const createCourse  = (data)   => api.post('/courses', data);

// ── Assignments ────────────────────────────────
/** Get a student's assignment submissions */
export const getMyAssignments     = (studentId) => api.get(`/assignments/student/${studentId}`);
export const getAssignmentsByCourse = (courseId) => api.get(`/assignments/course/${courseId}`);
export const submitAssignment     = (assignmentId) => api.post(`/assignments/${assignmentId}/submit`, {});
export const createAssignment     = (data) => api.post('/assignments', data);

// ── Quizzes ────────────────────────────────────
export const getQuizzesByCourse   = (courseId) => api.get(`/quizzes/course/${courseId}`);
export const getStudentQuizAttempts = (studentId) => api.get(`/quizzes/student/${studentId}/attempts`);
export const getQuizById          = (id)     => api.get(`/quizzes/${id}`);
export const submitQuiz           = (id, answers) => api.post(`/quizzes/${id}/attempt`, { answers });

// ── Attendance ─────────────────────────────────
export const getMyAttendance      = (studentId) => api.get(`/attendance/student/${studentId}`);
export const markAttendance       = (data) => api.post('/attendance/mark', data);

// ── Risk ───────────────────────────────────────
export const getStudentRiskFlags  = (studentId) => api.get(`/risk/student/${studentId}`);
export const getAllRiskFlags       = () => api.get('/risk/all');
export const detectRisk           = (studentId, data) => api.post(`/risk/detect/${studentId}`, data);

// ── Recovery ───────────────────────────────────
export const getStudentRecovery    = (studentId) => api.get(`/recovery/student/${studentId}`);
export const createRecoveryPath    = (studentId, data) => api.post(`/recovery/student/${studentId}`, data);
export const updateMilestone       = (pathId, milestoneId, status) =>
  api.patch(`/recovery/${pathId}/milestone/${milestoneId}`, { status });

// ── Faculty Reports ────────────────────────────
export const getReports           = () => api.get('/reports');
export const createReport         = (data) => api.post('/reports', data);
export const acknowledgeReport    = (id) => api.post(`/reports/${id}/acknowledge`);
export const getAcknowledgements  = () => api.get('/reports/acknowledgements/history');

// ── Notifications ──────────────────────────────
export const getNotifications     = () => api.get('/notifications');
export const getUnreadCount       = () => api.get('/notifications/unread-count');
export const markNotifRead        = (id) => api.patch(`/notifications/${id}/read`);
export const markAllNotifsRead    = () => api.patch('/notifications/read-all');

// ── Analytics ──────────────────────────────────
export const getDeptAnalytics     = (params) => api.get('/analytics/department', { params });
export const getStudentAnalytics  = (studentId) => api.get(`/analytics/student/${studentId}`);

// ── Resources ──────────────────────────────────
export const getResources         = () => api.get('/resources');

export default api;
