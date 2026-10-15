// Comprehensive mock data for EduPulse demo
// This data mirrors what the MongoDB seed creates

export const DEMO_USERS = {
  admin: {
    _id: 'user_admin_001',
    name: 'Dr. Admin Kumar',
    email: 'admin@edupulse.edu',
    password: 'admin123',
    role: 'admin',
    department: { name: 'Computer Science & Engineering', code: 'CSE' },
    avatar: '',
  },
  hod: {
    _id: 'user_hod_001',
    name: 'Dr. Meena Sharma',
    email: 'hod@edupulse.edu',
    password: 'hod123',
    role: 'hod',
    department: { name: 'Computer Science & Engineering', code: 'CSE' },
    avatar: '',
  },
  faculty: {
    _id: 'user_faculty_001',
    name: 'Dr. Priya Nair',
    email: 'faculty@edupulse.edu',
    password: 'faculty123',
    role: 'faculty',
    department: { name: 'Computer Science & Engineering', code: 'CSE' },
    avatar: '',
  },
  student: {
    _id: 'user_student_001',
    name: 'Arun Kumar',
    email: 'student@edupulse.edu',
    password: 'student123',
    role: 'student',
    rollNumber: 'CSE2024001',
    class: 'III CSE - A',
    year: 3,
    semester: 5,
    department: { name: 'Computer Science & Engineering', code: 'CSE' },
    parentId: 'user_parent_001',
    avatar: '',
  },
  parent: {
    _id: 'user_parent_001',
    name: 'Mr. Suresh Kumar',
    email: 'parent@edupulse.edu',
    password: 'parent123',
    role: 'parent',
    linkedStudents: ['user_student_001'],
    avatar: '',
  },
};

export const DEMO_COURSES = [
  {
    _id: 'course_001',
    name: 'Data Structures',
    code: 'CS301',
    faculty: { _id: 'user_faculty_001', name: 'Dr. Priya Nair' },
    department: { name: 'Computer Science & Engineering' },
    semester: 5, year: 3, credits: 4,
    description: 'Advanced data structures and algorithm design techniques',
    progress: 62,
    modules: [
      { title: 'Arrays and Linked Lists', description: 'Linear data structures', order: 1, completed: true },
      { title: 'Trees and Graphs', description: 'Non-linear structures', order: 2, completed: true },
      { title: 'Sorting Algorithms', description: 'Sorting techniques', order: 3, completed: false },
      { title: 'Dynamic Programming', description: 'DP approach', order: 4, completed: false },
    ],
    totalModules: 4,
    completedModules: 2,
    assignments: 3,
    quizScore: 40,
  },
  {
    _id: 'course_002',
    name: 'Database Management',
    code: 'CS302',
    faculty: { _id: 'user_faculty_002', name: 'Prof. Rajesh Iyer' },
    department: { name: 'Computer Science & Engineering' },
    semester: 5, year: 3, credits: 4,
    description: 'DBMS concepts, SQL, normalization and transaction management',
    progress: 74,
    modules: [
      { title: 'Relational Model', description: 'ER and relational concepts', order: 1, completed: true },
      { title: 'SQL Queries', description: 'DDL, DML, DCL', order: 2, completed: true },
      { title: 'Normalization', description: '1NF to BCNF', order: 3, completed: false },
    ],
    totalModules: 3,
    completedModules: 2,
    assignments: 2,
    quizScore: 40,
  },
  {
    _id: 'course_003',
    name: 'Operating Systems',
    code: 'CS303',
    faculty: { _id: 'user_faculty_003', name: 'Dr. Anitha Krishnan' },
    department: { name: 'Computer Science & Engineering' },
    semester: 5, year: 3, credits: 4,
    description: 'Process management, memory management and file systems',
    progress: 48,
    modules: [
      { title: 'Process Management', description: 'Processes and threads', order: 1, completed: true },
      { title: 'Memory Management', description: 'Paging and segmentation', order: 2, completed: false },
      { title: 'File Systems', description: 'File management', order: 3, completed: false },
    ],
    totalModules: 3,
    completedModules: 1,
    assignments: 2,
    quizScore: null,
  },
  {
    _id: 'course_004',
    name: 'Computer Networks',
    code: 'CS304',
    faculty: { _id: 'user_faculty_001', name: 'Dr. Priya Nair' },
    department: { name: 'Computer Science & Engineering' },
    semester: 5, year: 3, credits: 3,
    description: 'Network protocols, TCP/IP, OSI model and network security',
    progress: 85,
    modules: [
      { title: 'OSI Model', description: 'Seven layers', order: 1, completed: true },
      { title: 'TCP/IP', description: 'Internet protocols', order: 2, completed: true },
    ],
    totalModules: 2,
    completedModules: 2,
    assignments: 1,
    quizScore: 78,
  },
];

export const DEMO_ASSIGNMENTS = [
  {
    _id: 'assign_001',
    title: 'Assignment 3: Binary Search Trees',
    course: { _id: 'course_001', name: 'Data Structures', code: 'CS301' },
    faculty: { name: 'Dr. Priya Nair' },
    description: 'Implement BST insertion, deletion and traversal operations with time complexity analysis.',
    dueDate: '2026-09-22',
    maxScore: 100,
    status: 'incomplete',
    score: null,
  },
  {
    _id: 'assign_002',
    title: 'SQL Query Optimization',
    course: { _id: 'course_002', name: 'Database Management', code: 'CS302' },
    faculty: { name: 'Prof. Rajesh Iyer' },
    description: 'Optimize the given SQL queries and explain the execution plan.',
    dueDate: '2026-09-28',
    maxScore: 100,
    status: 'pending',
    score: null,
  },
  {
    _id: 'assign_003',
    title: 'Process Scheduling Simulation',
    course: { _id: 'course_003', name: 'Operating Systems', code: 'CS303' },
    faculty: { name: 'Dr. Anitha Krishnan' },
    description: 'Simulate FCFS, SJF and Round Robin scheduling algorithms.',
    dueDate: '2026-09-19',
    maxScore: 100,
    status: 'overdue',
    score: null,
  },
  {
    _id: 'assign_004',
    title: 'Network Topology Design',
    course: { _id: 'course_004', name: 'Computer Networks', code: 'CS304' },
    faculty: { name: 'Dr. Priya Nair' },
    description: 'Design a star and mesh topology for a college campus network.',
    dueDate: '2026-09-20',
    maxScore: 100,
    status: 'submitted',
    score: 72,
    submittedAt: '2026-09-20',
  },
];

export const DEMO_QUIZZES = [
  {
    _id: 'quiz_001',
    title: 'Data Structures Quiz 2',
    course: { _id: 'course_001', name: 'Data Structures', code: 'CS301' },
    faculty: { name: 'Dr. Priya Nair' },
    questions: [
      {
        question: 'What is the time complexity of searching in a balanced BST?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 1, marks: 10
      },
      {
        question: 'Which data structure uses LIFO principle?',
        options: ['Queue', 'Stack', 'Linked List', 'Array'],
        correctAnswer: 1, marks: 10
      },
      {
        question: 'What is the height of a complete binary tree with n nodes?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correctAnswer: 1, marks: 10
      },
      {
        question: 'In a max-heap, the parent node is always:',
        options: ['Less than children', 'Greater than or equal to children', 'Equal to children', 'None of these'],
        correctAnswer: 1, marks: 10
      },
      {
        question: 'Which traversal visits root first?',
        options: ['Inorder', 'Postorder', 'Preorder', 'Level order'],
        correctAnswer: 2, marks: 10
      },
    ],
    duration: 30, maxScore: 50,
    dueDate: '2026-09-26',
    attempt: { score: 20, percentage: 40, status: 'completed', submittedAt: '2026-09-20' },
  },
  {
    _id: 'quiz_002',
    title: 'Database Internal Test',
    course: { _id: 'course_002', name: 'Database Management', code: 'CS302' },
    faculty: { name: 'Prof. Rajesh Iyer' },
    questions: [
      {
        question: 'ACID stands for?',
        options: ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Consistency, Integrity, Durability', 'Atomicity, Correctness, Isolation, Data', 'None'],
        correctAnswer: 0, marks: 10
      },
      {
        question: 'Which SQL command is used to retrieve data?',
        options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'],
        correctAnswer: 2, marks: 10
      },
      {
        question: 'Primary key constraint ensures:',
        options: ['Uniqueness only', 'Not null only', 'Both uniqueness and not null', 'Foreign key reference'],
        correctAnswer: 2, marks: 10
      },
      {
        question: 'Which normal form eliminates transitive dependencies?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctAnswer: 2, marks: 10
      },
      {
        question: 'JOIN operation combines rows from:',
        options: ['One table', 'Two or more tables', 'Subqueries only', 'Views only'],
        correctAnswer: 1, marks: 10
      },
    ],
    duration: 45, maxScore: 50,
    dueDate: '2026-09-24',
    attempt: { score: 20, percentage: 40, status: 'completed', submittedAt: '2026-09-22' },
  },
  {
    _id: 'quiz_003',
    title: 'OS Unit Test 1',
    course: { _id: 'course_003', name: 'Operating Systems', code: 'CS303' },
    faculty: { name: 'Dr. Anitha Krishnan' },
    questions: [
      {
        question: 'A process in blocked state is waiting for:',
        options: ['CPU', 'I/O', 'Memory', 'All of the above'],
        correctAnswer: 1, marks: 10
      },
      {
        question: 'Deadlock prevention requires:',
        options: ['Hold and wait elimination', 'No preemption', 'Circular wait elimination', 'All of the above'],
        correctAnswer: 3, marks: 10
      },
      {
        question: 'Virtual memory is managed by:',
        options: ['CPU', 'OS', 'Compiler', 'User'],
        correctAnswer: 1, marks: 10
      },
    ],
    duration: 30, maxScore: 30,
    dueDate: '2026-09-30',
    attempt: null,
  },
  {
    _id: 'quiz_004',
    title: 'Computer Networks Quiz 1',
    course: { _id: 'course_004', name: 'Computer Networks', code: 'CS304' },
    faculty: { name: 'Dr. Priya Nair' },
    questions: [
      {
        question: 'The OSI model has how many layers?',
        options: ['5', '6', '7', '8'],
        correctAnswer: 2, marks: 10
      },
      {
        question: 'Which layer handles routing?',
        options: ['Data Link', 'Network', 'Transport', 'Session'],
        correctAnswer: 1, marks: 10
      },
    ],
    duration: 20, maxScore: 20,
    dueDate: '2026-09-18',
    attempt: { score: 16, percentage: 80, status: 'completed', submittedAt: '2026-09-18' },
  },
];

export const DEMO_ATTENDANCE = {
  overall: 68,
  present: 102,
  absent: 48,
  total: 150,
  courses: [
    { course: { _id: 'course_001', name: 'Data Structures', code: 'CS301' }, present: 22, absent: 13, total: 35, percentage: 63, isLow: true },
    { course: { _id: 'course_002', name: 'Database Management', code: 'CS302' }, present: 32, absent: 4, total: 36, percentage: 89, isLow: false },
    { course: { _id: 'course_003', name: 'Operating Systems', code: 'CS303' }, present: 24, absent: 11, total: 35, percentage: 69, isLow: true },
    { course: { _id: 'course_004', name: 'Computer Networks', code: 'CS304' }, present: 38, absent: 6, total: 44, percentage: 86, isLow: false },
  ],
  history: [
    { date: '2026-09-25', course: 'CS301', status: 'absent' },
    { date: '2026-09-25', course: 'CS302', status: 'present' },
    { date: '2026-09-24', course: 'CS301', status: 'absent' },
    { date: '2026-09-24', course: 'CS303', status: 'present' },
    { date: '2026-09-23', course: 'CS301', status: 'present' },
    { date: '2026-09-23', course: 'CS304', status: 'present' },
    { date: '2026-09-22', course: 'CS302', status: 'present' },
    { date: '2026-09-22', course: 'CS303', status: 'absent' },
    { date: '2026-09-21', course: 'CS301', status: 'absent' },
    { date: '2026-09-21', course: 'CS304', status: 'present' },
  ]
};

export const DEMO_RISK_FLAG = {
  _id: 'risk_001',
  level: 'high',
  reasons: ['Attendance: 68%', 'Assignment completion: 50%', 'Quiz average: 40%'],
  attendancePercent: 68,
  assignmentCompletionPercent: 50,
  quizAveragePercent: 40,
  isActive: true,
  createdAt: '2026-09-20',
};

export const DEMO_RECOVERY_PATH = {
  _id: 'recovery_001',
  progressPercent: 33,
  status: 'active',
  milestones: [
    {
      _id: 'm_001',
      title: 'Risk Identified',
      description: 'High risk level detected – Attendance: 68%, Quiz: 40%, Assignments: 50%',
      status: 'completed',
      order: 1,
      completedAt: '2026-09-20',
    },
    {
      _id: 'm_002',
      title: 'Review Learning Material',
      description: 'Study recommended resources for Data Structures and DBMS',
      status: 'completed',
      order: 2,
      completedAt: '2026-09-22',
    },
    {
      _id: 'm_003',
      title: 'Complete Practice Quiz',
      description: 'Attempt the practice quizzes for weak subjects',
      status: 'current',
      order: 3,
      dueDate: '2026-09-30',
    },
    {
      _id: 'm_004',
      title: 'Submit Pending Assignment',
      description: 'Complete and submit all incomplete assignments',
      status: 'pending',
      order: 4,
      dueDate: '2026-10-05',
    },
    {
      _id: 'm_005',
      title: 'Faculty Review',
      description: 'Schedule meeting with faculty to review academic progress',
      status: 'pending',
      order: 5,
      dueDate: '2026-10-10',
    },
    {
      _id: 'm_006',
      title: 'Recovery Complete',
      description: 'Risk resolved and performance back on track',
      status: 'pending',
      order: 6,
    },
  ],
};

export const DEMO_FACULTY_REPORTS = [
  {
    _id: 'report_001',
    faculty: { _id: 'user_faculty_001', name: 'Dr. Priya Nair', email: 'faculty@edupulse.edu' },
    student: { _id: 'user_student_001', name: 'Arun Kumar', rollNumber: 'CSE2024001', class: 'III CSE - A' },
    course: { _id: 'course_001', name: 'Data Structures', code: 'CS301' },
    concernType: 'low_quiz_performance',
    description: 'Student Arun Kumar scored only 40% in the Data Structures Quiz 2 and has not completed Assignment 3 (BST Implementation). The student has been absent for multiple consecutive classes which is significantly affecting performance. Immediate intervention required.',
    severity: 'medium',
    parentAcknowledged: false,
    acknowledgedAt: null,
    createdAt: '2026-09-24',
    isActive: true,
  },
  {
    _id: 'report_002',
    faculty: { _id: 'user_faculty_002', name: 'Prof. Rajesh Iyer', email: 'faculty2@edupulse.edu' },
    student: { _id: 'user_student_001', name: 'Arun Kumar', rollNumber: 'CSE2024001', class: 'III CSE - A' },
    course: { _id: 'course_002', name: 'Database Management', code: 'CS302' },
    concernType: 'low_attendance',
    description: 'Student has been attending DBMS classes irregularly. Though overall quiz performance was average, the student needs to attend classes regularly to avoid further academic issues.',
    severity: 'low',
    parentAcknowledged: true,
    acknowledgedAt: '2026-09-18T10:35:00',
    parentId: 'user_parent_001',
    createdAt: '2026-09-15',
    isActive: true,
  },
];

export const DEMO_NOTIFICATIONS = {
  parent: [
    {
      _id: 'notif_p_001',
      title: 'Faculty Academic Report',
      message: 'Dr. Priya Nair has submitted a new academic concern regarding your ward Arun Kumar. The concern is about low quiz performance in Data Structures.',
      type: 'faculty_report',
      isRead: false,
      relatedReport: 'report_001',
      relatedStudent: 'user_student_001',
      createdAt: '2026-09-24T09:15:00',
    },
    {
      _id: 'notif_p_002',
      title: 'Low Performance Alert',
      message: "Your ward's performance in Data Structures has fallen below the configured threshold. Current quiz average: 40%.",
      type: 'low_performance',
      isRead: false,
      createdAt: '2026-09-23T14:30:00',
    },
    {
      _id: 'notif_p_003',
      title: 'Incomplete Assignment Alert',
      message: "Your ward Arun Kumar has an incomplete assignment in Data Structures (Assignment 3: BST). Due date was 22nd September.",
      type: 'incomplete_assignment',
      isRead: true,
      createdAt: '2026-09-22T11:00:00',
    },
    {
      _id: 'notif_p_004',
      title: 'Attendance Alert',
      message: "Your ward's overall attendance has fallen to 68%, which is below the required 75% threshold.",
      type: 'attendance_alert',
      isRead: true,
      createdAt: '2026-09-20T09:00:00',
    },
    {
      _id: 'notif_p_005',
      title: 'Recovery Progress Update',
      message: "Your ward Arun Kumar has completed 2 of 6 recovery milestones. Keep encouraging them!",
      type: 'recovery_progress',
      isRead: false,
      createdAt: '2026-09-22T16:45:00',
    },
  ],
  student: [
    {
      _id: 'notif_s_001',
      title: 'High Risk Detected',
      message: 'Your academic performance has been flagged as High Risk. Attendance: 68%, Assignment Completion: 50%, Quiz Average: 40%. Please follow your recovery path.',
      type: 'risk_flag',
      isRead: false,
      createdAt: '2026-09-20T10:00:00',
    },
    {
      _id: 'notif_s_002',
      title: 'New Faculty Report',
      message: 'Dr. Priya Nair has submitted an academic concern regarding your Data Structures performance.',
      type: 'faculty_report',
      isRead: false,
      createdAt: '2026-09-24T09:15:00',
    },
    {
      _id: 'notif_s_003',
      title: 'Recovery Milestone Update',
      message: 'Complete the Practice Quiz to advance to the next step in your recovery path.',
      type: 'recovery_progress',
      isRead: true,
      createdAt: '2026-09-22T16:45:00',
    },
  ],
  faculty: [
    {
      _id: 'notif_f_001',
      title: 'Report Acknowledged by Parent',
      message: 'Parent (Mr. Suresh Kumar) has acknowledged the DBMS attendance report you submitted for Arun Kumar.',
      type: 'acknowledgement',
      isRead: false,
      createdAt: '2026-09-18T10:35:00',
    },
    {
      _id: 'notif_f_002',
      title: 'New At-Risk Student Alert',
      message: 'Student Karthik Rajan (CSE2024003) has been flagged as Medium Risk. Please review.',
      type: 'risk_flag',
      isRead: true,
      createdAt: '2026-09-21T11:00:00',
    },
  ],
  hod: [
    {
      _id: 'notif_h_001',
      title: 'Department Alert',
      message: '3 students in III CSE are currently at high or medium risk. Faculty intervention recommended.',
      type: 'risk_flag',
      isRead: false,
      createdAt: '2026-09-24T08:00:00',
    },
  ],
};

export const DEMO_AT_RISK_STUDENTS = [
  {
    _id: 'user_student_001',
    name: 'Arun Kumar',
    rollNumber: 'CSE2024001',
    class: 'III CSE - A',
    attendance: 68,
    performance: 44,
    riskLevel: 'high',
    reasons: ['Attendance: 68%', 'Assignment completion: 50%', 'Quiz average: 40%'],
    assignmentCompletion: 50,
    quizAverage: 40,
    pendingReports: 1,
  },
  {
    _id: 'user_student_003',
    name: 'Karthik Rajan',
    rollNumber: 'CSE2024003',
    class: 'III CSE - B',
    attendance: 78,
    performance: 52,
    riskLevel: 'medium',
    reasons: ['Quiz average: 42%', 'Assignment completion: 58%'],
    assignmentCompletion: 58,
    quizAverage: 42,
    pendingReports: 0,
  },
  {
    _id: 'user_student_004',
    name: 'Deepa Venkat',
    rollNumber: 'CSE2024004',
    class: 'III CSE - A',
    attendance: 70,
    performance: 61,
    riskLevel: 'low',
    reasons: ['Attendance: 70%'],
    assignmentCompletion: 72,
    quizAverage: 61,
    pendingReports: 0,
  },
];

export const DEMO_RESOURCES = [
  {
    _id: 'res_001',
    title: 'Data Structures Visualization',
    course: { name: 'Data Structures', code: 'CS301' },
    type: 'video',
    url: 'https://visualgo.net',
    description: 'Interactive visualization of data structures including trees, graphs, and sorting',
    rating: 4.8,
    tags: ['trees', 'graphs', 'sorting'],
  },
  {
    _id: 'res_002',
    title: 'Sorting Algorithms Explained',
    course: { name: 'Data Structures', code: 'CS301' },
    type: 'article',
    url: '#',
    description: 'Comprehensive guide to sorting algorithms with time and space complexity analysis',
    rating: 4.6,
    tags: ['sorting', 'algorithms'],
  },
  {
    _id: 'res_003',
    title: 'SQL Practice Problems',
    course: { name: 'Database Management', code: 'CS302' },
    type: 'practice',
    url: '#',
    description: 'Hands-on SQL exercises from basic SELECT to advanced joins and subqueries',
    rating: 4.7,
    tags: ['sql', 'database'],
  },
  {
    _id: 'res_004',
    title: 'OS Concepts Video Series',
    course: { name: 'Operating Systems', code: 'CS303' },
    type: 'video',
    url: '#',
    description: 'Complete operating systems concepts video playlist covering processes, memory and file systems',
    rating: 4.5,
    tags: ['processes', 'memory'],
  },
  {
    _id: 'res_005',
    title: 'Database Normalization Guide',
    course: { name: 'Database Management', code: 'CS302' },
    type: 'pdf',
    url: '#',
    description: 'Detailed normalization guide from 1NF to BCNF with real-world examples',
    rating: 4.3,
    tags: ['normalization', 'database'],
  },
];

export const DEMO_PERFORMANCE_CHART = [
  { month: 'Jul', quizScore: 72, assignmentScore: 78, overall: 75 },
  { month: 'Aug', quizScore: 65, assignmentScore: 70, overall: 68 },
  { month: 'Sep', quizScore: 40, assignmentScore: 50, overall: 44 },
];

export const DEMO_HOD_STATS = {
  totalStudents: 180,
  totalFaculty: 12,
  totalClasses: 6,
  atRiskStudents: 18,
  departmentAttendance: 82,
  avgPerformance: 74,
  classPerformance: [
    { class: 'I CSE', avg: 82, attendance: 88 },
    { class: 'II CSE', avg: 77, attendance: 84 },
    { class: 'III CSE', avg: 71, attendance: 79 },
    { class: 'IV CSE', avg: 75, attendance: 82 },
  ],
  riskDistribution: [
    { level: 'High', count: 6, color: '#ef4444' },
    { level: 'Medium', count: 8, color: '#f97316' },
    { level: 'Low', count: 4, color: '#f59e0b' },
  ],
};

export const DEMO_ADMIN_STATS = {
  totalStudents: 1240,
  totalFaculty: 68,
  departments: 8,
  atRiskStudents: 94,
  avgAttendance: 81,
  recoveryCompletion: 62,
};

export const ACKNOWLEDGEMENT_HISTORY = [
  {
    _id: 'ack_001',
    report: {
      _id: 'report_002',
      concernType: 'low_attendance',
      faculty: { name: 'Prof. Rajesh Iyer' },
      course: { name: 'Database Management' },
      severity: 'low',
    },
    acknowledgedAt: '2026-09-18T10:35:00',
    status: 'acknowledged',
  },
];
