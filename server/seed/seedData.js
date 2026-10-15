require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const { Assignment, AssignmentSubmission } = require('../models/Assignment');
const { Quiz, QuizAttempt } = require('../models/Quiz');
const Attendance = require('../models/Attendance');
const RiskFlag = require('../models/RiskFlag');
const RecoveryPath = require('../models/RecoveryPath');
const FacultyReport = require('../models/FacultyReport');
const ParentAcknowledgement = require('../models/ParentAcknowledgement');
const Notification = require('../models/Notification');
const LearningResource = require('../models/LearningResource');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}), Department.deleteMany({}), Course.deleteMany({}),
      Assignment.deleteMany({}), AssignmentSubmission.deleteMany({}),
      Quiz.deleteMany({}), QuizAttempt.deleteMany({}), Attendance.deleteMany({}),
      RiskFlag.deleteMany({}), RecoveryPath.deleteMany({}),
      FacultyReport.deleteMany({}), ParentAcknowledgement.deleteMany({}),
      Notification.deleteMany({}), LearningResource.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create Department
    const csDept = await Department.create({ name: 'Computer Science & Engineering', code: 'CSE', description: 'Department of Computer Science' });
    const itDept = await Department.create({ name: 'Information Technology', code: 'IT', description: 'Department of Information Technology' });

    // Create Admin
    const admin = await User.create({
      name: 'Dr. Admin Kumar', email: 'admin@edupulse.edu', password: 'admin123',
      role: 'admin', department: csDept._id, avatar: '',
    });

    // Create HoD
    const hod = await User.create({
      name: 'Dr. Meena Sharma', email: 'hod@edupulse.edu', password: 'hod123',
      role: 'hod', department: csDept._id, avatar: '',
    });
    await Department.findByIdAndUpdate(csDept._id, { hod: hod._id });

    // Create Faculty
    const faculty1 = await User.create({
      name: 'Dr. Priya Nair', email: 'faculty@edupulse.edu', password: 'faculty123',
      role: 'faculty', department: csDept._id, avatar: '',
    });
    const faculty2 = await User.create({
      name: 'Prof. Rajesh Iyer', email: 'faculty2@edupulse.edu', password: 'faculty123',
      role: 'faculty', department: csDept._id, avatar: '',
    });
    const faculty3 = await User.create({
      name: 'Dr. Anitha Krishnan', email: 'faculty3@edupulse.edu', password: 'faculty123',
      role: 'faculty', department: csDept._id, avatar: '',
    });

    // Create Parent (before student, so we have the ID)
    const parent = await User.create({
      name: 'Mr. Suresh Kumar', email: 'parent@edupulse.edu', password: 'parent123',
      role: 'parent', department: csDept._id, avatar: '', linkedStudents: [],
    });

    // Create Students
    const student = await User.create({
      name: 'Arun Kumar', email: 'student@edupulse.edu', password: 'student123',
      role: 'student', department: csDept._id, rollNumber: 'CSE2024001',
      class: 'III CSE - A', year: 3, semester: 5, parentId: parent._id, avatar: '',
    });

    const student2 = await User.create({
      name: 'Preethi Anand', email: 'student2@edupulse.edu', password: 'student123',
      role: 'student', department: csDept._id, rollNumber: 'CSE2024002',
      class: 'III CSE - A', year: 3, semester: 5, parentId: null, avatar: '',
    });

    const student3 = await User.create({
      name: 'Karthik Rajan', email: 'student3@edupulse.edu', password: 'student123',
      role: 'student', department: csDept._id, rollNumber: 'CSE2024003',
      class: 'III CSE - B', year: 3, semester: 5, parentId: null, avatar: '',
    });

    // Link parent to student
    await User.findByIdAndUpdate(parent._id, { linkedStudents: [student._id] });

    // Create Courses
    const courseDS = await Course.create({
      name: 'Data Structures', code: 'CS301', department: csDept._id,
      faculty: faculty1._id, semester: 5, year: 3, credits: 4,
      description: 'Advanced data structures and algorithm design',
      modules: [
        { title: 'Arrays and Linked Lists', description: 'Linear data structures', order: 1 },
        { title: 'Trees and Graphs', description: 'Non-linear structures', order: 2 },
        { title: 'Sorting Algorithms', description: 'Sorting techniques', order: 3 },
        { title: 'Dynamic Programming', description: 'DP approach', order: 4 },
      ]
    });

    const courseDB = await Course.create({
      name: 'Database Management', code: 'CS302', department: csDept._id,
      faculty: faculty2._id, semester: 5, year: 3, credits: 4,
      description: 'DBMS concepts, SQL, normalization',
      modules: [
        { title: 'Relational Model', description: 'ER and relational concepts', order: 1 },
        { title: 'SQL Queries', description: 'DDL, DML, DCL', order: 2 },
        { title: 'Normalization', description: '1NF to BCNF', order: 3 },
      ]
    });

    const courseOS = await Course.create({
      name: 'Operating Systems', code: 'CS303', department: csDept._id,
      faculty: faculty3._id, semester: 5, year: 3, credits: 4,
      description: 'Process management, memory, file systems',
      modules: [
        { title: 'Process Management', description: 'Processes and threads', order: 1 },
        { title: 'Memory Management', description: 'Paging and segmentation', order: 2 },
        { title: 'File Systems', description: 'File management', order: 3 },
      ]
    });

    const courseCN = await Course.create({
      name: 'Computer Networks', code: 'CS304', department: csDept._id,
      faculty: faculty1._id, semester: 5, year: 3, credits: 3,
      description: 'Network protocols, TCP/IP, OSI model',
      modules: [
        { title: 'OSI Model', description: 'Seven layers', order: 1 },
        { title: 'TCP/IP', description: 'Internet protocols', order: 2 },
      ]
    });

    // Create Learning Resources
    const resources = await LearningResource.insertMany([
      { title: 'Data Structures Visualization', course: courseDS._id, type: 'video', url: 'https://visualgo.net', description: 'Interactive visualization of data structures', rating: 4.8, tags: ['trees', 'graphs', 'sorting'] },
      { title: 'Sorting Algorithms Explained', course: courseDS._id, type: 'article', url: '#', description: 'Comprehensive guide to sorting algorithms with complexity analysis', rating: 4.6, tags: ['sorting', 'algorithms'] },
      { title: 'SQL Practice Problems', course: courseDB._id, type: 'practice', url: '#', description: 'Hands-on SQL exercises from basic to advanced level', rating: 4.7, tags: ['sql', 'database'] },
      { title: 'OS Concepts Video Series', course: courseOS._id, type: 'video', url: '#', description: 'Complete operating systems concepts video playlist', rating: 4.5, tags: ['processes', 'memory'] },
      { title: 'Database Normalization PDF', course: courseDB._id, type: 'pdf', url: '#', description: 'Detailed normalization guide with examples', rating: 4.3, tags: ['normalization', 'database'] },
    ]);

    // Create Assignments
    const assign1 = await Assignment.create({
      title: 'Assignment 3: Binary Search Trees',
      course: courseDS._id, faculty: faculty1._id,
      description: 'Implement BST insertion, deletion and traversal operations with time complexity analysis.',
      dueDate: new Date('2026-09-22'), maxScore: 100,
    });

    const assign2 = await Assignment.create({
      title: 'SQL Query Optimization',
      course: courseDB._id, faculty: faculty2._id,
      description: 'Optimize the given SQL queries and explain the execution plan.',
      dueDate: new Date('2026-09-28'), maxScore: 100,
    });

    const assign3 = await Assignment.create({
      title: 'Process Scheduling Simulation',
      course: courseOS._id, faculty: faculty3._id,
      description: 'Simulate FCFS, SJF and Round Robin scheduling algorithms.',
      dueDate: new Date('2026-10-05'), maxScore: 100,
    });

    const assign4 = await Assignment.create({
      title: 'Network Topology Design',
      course: courseCN._id, faculty: faculty1._id,
      description: 'Design a star and mesh topology for a college campus network.',
      dueDate: new Date('2026-10-10'), maxScore: 100,
    });

    // Create Assignment Submissions for student (Arun)
    await AssignmentSubmission.create({ assignment: assign1._id, student: student._id, status: 'incomplete', score: null });
    await AssignmentSubmission.create({ assignment: assign2._id, student: student._id, status: 'pending', score: null });
    await AssignmentSubmission.create({ assignment: assign3._id, student: student._id, status: 'overdue', score: null });
    await AssignmentSubmission.create({ assignment: assign4._id, student: student._id, status: 'submitted', score: 72, submittedAt: new Date('2026-09-20') });

    // Submissions for student2 (good student)
    await AssignmentSubmission.create({ assignment: assign1._id, student: student2._id, status: 'submitted', score: 88, submittedAt: new Date('2026-09-19') });
    await AssignmentSubmission.create({ assignment: assign2._id, student: student2._id, status: 'submitted', score: 91, submittedAt: new Date('2026-09-25') });

    // Create Quizzes
    const quiz1 = await Quiz.create({
      title: 'Data Structures Quiz 2',
      course: courseDS._id, faculty: faculty1._id,
      questions: [
        { question: 'What is the time complexity of searching in a balanced BST?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 1, marks: 10 },
        { question: 'Which data structure uses LIFO principle?', options: ['Queue', 'Stack', 'Linked List', 'Array'], correctAnswer: 1, marks: 10 },
        { question: 'What is the height of a complete binary tree with n nodes?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctAnswer: 1, marks: 10 },
        { question: 'In a max-heap, the parent node is always:', options: ['Less than children', 'Greater than or equal to children', 'Equal to children', 'None of these'], correctAnswer: 1, marks: 10 },
        { question: 'Which traversal visits root first?', options: ['Inorder', 'Postorder', 'Preorder', 'Level order'], correctAnswer: 2, marks: 10 },
      ],
      duration: 30, maxScore: 50, dueDate: new Date('2026-09-26'),
    });

    const quiz2 = await Quiz.create({
      title: 'Database Internal Test',
      course: courseDB._id, faculty: faculty2._id,
      questions: [
        { question: 'ACID stands for?', options: ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Consistency, Integrity, Durability', 'Atomicity, Correctness, Isolation, Data', 'None'], correctAnswer: 0, marks: 10 },
        { question: 'Which SQL command is used to retrieve data?', options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], correctAnswer: 2, marks: 10 },
        { question: 'Primary key constraint ensures:', options: ['Uniqueness only', 'Not null only', 'Both uniqueness and not null', 'Foreign key reference'], correctAnswer: 2, marks: 10 },
        { question: 'Which normal form eliminates transitive dependencies?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctAnswer: 2, marks: 10 },
        { question: 'JOIN operation combines rows from:', options: ['One table', 'Two or more tables', 'Subqueries only', 'Views only'], correctAnswer: 1, marks: 10 },
      ],
      duration: 45, maxScore: 50, dueDate: new Date('2026-09-24'),
    });

    const quiz3 = await Quiz.create({
      title: 'OS Unit Test 1',
      course: courseOS._id, faculty: faculty3._id,
      questions: [
        { question: 'A process in blocked state is waiting for:', options: ['CPU', 'I/O', 'Memory', 'All of the above'], correctAnswer: 1, marks: 10 },
        { question: 'Deadlock prevention requires:', options: ['Hold and wait elimination', 'No preemption', 'Circular wait elimination', 'All of the above'], correctAnswer: 3, marks: 10 },
        { question: 'Virtual memory is managed by:', options: ['CPU', 'OS', 'Compiler', 'User'], correctAnswer: 1, marks: 10 },
      ],
      duration: 30, maxScore: 30,
    });

    // Quiz Attempts for student (Arun - low performance)
    await QuizAttempt.create({
      quiz: quiz1._id, student: student._id,
      answers: [{ questionIndex: 0, selectedAnswer: 0 }, { questionIndex: 1, selectedAnswer: 1 }, { questionIndex: 2, selectedAnswer: 2 }, { questionIndex: 3, selectedAnswer: 0 }, { questionIndex: 4, selectedAnswer: 0 }],
      score: 20, percentage: 40, status: 'completed', submittedAt: new Date('2026-09-20'),
    });
    await QuizAttempt.create({
      quiz: quiz2._id, student: student._id,
      answers: [{ questionIndex: 0, selectedAnswer: 0 }, { questionIndex: 1, selectedAnswer: 2 }, { questionIndex: 2, selectedAnswer: 0 }, { questionIndex: 3, selectedAnswer: 1 }, { questionIndex: 4, selectedAnswer: 1 }],
      score: 20, percentage: 40, status: 'completed', submittedAt: new Date('2026-09-22'),
    });

    // Student2 good performance
    await QuizAttempt.create({
      quiz: quiz1._id, student: student2._id,
      answers: [{ questionIndex: 0, selectedAnswer: 1 }, { questionIndex: 1, selectedAnswer: 1 }, { questionIndex: 2, selectedAnswer: 1 }, { questionIndex: 3, selectedAnswer: 1 }, { questionIndex: 4, selectedAnswer: 2 }],
      score: 50, percentage: 100, status: 'completed', submittedAt: new Date('2026-09-20'),
    });

    // Generate Attendance for Arun (68% overall)
    const startDate = new Date('2026-07-01');
    const courses = [courseDS, courseDB, courseOS, courseCN];
    const attendanceRates = { [courseDS._id]: 0.64, [courseDB._id]: 0.91, [courseOS._id]: 0.68, [courseCN._id]: 0.87 };

    for (let d = 0; d < 60; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + d);
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      for (const course of courses) {
        const rate = attendanceRates[course._id];
        const status = Math.random() < rate ? 'present' : 'absent';
        await Attendance.create({ student: student._id, course: course._id, date, status, markedBy: faculty1._id });
      }
    }

    // Attendance for student2 (good)
    for (let d = 0; d < 60; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + d);
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      for (const course of courses) {
        const status = Math.random() < 0.92 ? 'present' : 'absent';
        await Attendance.create({ student: student2._id, course: course._id, date, status, markedBy: faculty1._id });
      }
    }

    // Create Risk Flag for Arun
    const riskFlag = await RiskFlag.create({
      student: student._id,
      level: 'high',
      reasons: ['Attendance: 68%', 'Assignment completion: 50%', 'Quiz average: 40%'],
      attendancePercent: 68,
      assignmentCompletionPercent: 50,
      quizAveragePercent: 40,
      isActive: true,
    });

    // Medium risk for student3
    const riskFlag3 = await RiskFlag.create({
      student: student3._id,
      level: 'medium',
      reasons: ['Quiz average: 42%', 'Assignment completion: 58%'],
      attendancePercent: 78,
      assignmentCompletionPercent: 58,
      quizAveragePercent: 42,
      isActive: true,
    });

    // Create Recovery Path for Arun
    const recoveryPath = await RecoveryPath.create({
      student: student._id,
      riskFlag: riskFlag._id,
      milestones: [
        { title: 'Risk Identified', description: 'High risk level detected by EduPulse system', status: 'completed', order: 1, completedAt: new Date('2026-09-20') },
        { title: 'Review Learning Material', description: 'Study the recommended resources for Data Structures and DBMS', status: 'completed', order: 2, completedAt: new Date('2026-09-22') },
        { title: 'Complete Practice Quiz', description: 'Attempt the practice quizzes for weak subjects', status: 'current', order: 3 },
        { title: 'Submit Pending Assignment', description: 'Complete and submit all incomplete assignments', status: 'pending', order: 4 },
        { title: 'Faculty Review', description: 'Meet with faculty to review academic progress', status: 'pending', order: 5 },
        { title: 'Recovery Complete', description: 'Risk resolved and performance back on track', status: 'pending', order: 6 },
      ],
      progressPercent: 33,
      status: 'active',
    });

    // Create Faculty Report
    const facultyReport = await FacultyReport.create({
      faculty: faculty1._id,
      student: student._id,
      course: courseDS._id,
      concernType: 'low_quiz_performance',
      description: 'Student Arun Kumar scored only 40% in the Data Structures Quiz 2 and has not completed Assignment 3 (BST Implementation). The student has been absent for multiple classes which seems to be affecting performance significantly.',
      severity: 'medium',
      parentAcknowledged: false,
      parentId: null,
    });

    const facultyReport2 = await FacultyReport.create({
      faculty: faculty2._id,
      student: student._id,
      course: courseDB._id,
      concernType: 'low_attendance',
      description: 'Student has been attending DBMS classes irregularly. Though quiz performance was 40%, the student needs to attend classes regularly.',
      severity: 'low',
      parentAcknowledged: true,
      acknowledgedAt: new Date('2026-09-18'),
      parentId: parent._id,
    });

    // Parent Acknowledgement for report 2
    await ParentAcknowledgement.create({
      report: facultyReport2._id,
      parent: parent._id,
      student: student._id,
      acknowledgedAt: new Date('2026-09-18'),
      status: 'acknowledged',
    });

    // Create Notifications
    await Notification.insertMany([
      {
        recipient: parent._id,
        title: 'Faculty Academic Report',
        message: 'Dr. Priya Nair has submitted a new academic concern regarding your ward Arun Kumar. The concern is about low quiz performance in Data Structures.',
        type: 'faculty_report',
        isRead: false,
        relatedReport: facultyReport._id,
        relatedStudent: student._id,
      },
      {
        recipient: parent._id,
        title: 'Low Performance Alert',
        message: "Your ward's performance in Data Structures has fallen below the configured threshold. Current quiz average: 40%.",
        type: 'low_performance',
        isRead: false,
        relatedStudent: student._id,
      },
      {
        recipient: parent._id,
        title: 'Incomplete Assignment Alert',
        message: "Your ward Arun Kumar has an incomplete assignment in Data Structures (Assignment 3: BST). Due date was 22nd September.",
        type: 'incomplete_assignment',
        isRead: true,
        relatedStudent: student._id,
      },
      {
        recipient: parent._id,
        title: 'Attendance Alert',
        message: "Your ward's overall attendance has fallen to 68%, which is below the required 75% threshold.",
        type: 'attendance_alert',
        isRead: true,
        relatedStudent: student._id,
      },
      {
        recipient: parent._id,
        title: 'Recovery Progress Update',
        message: "Your ward Arun Kumar has completed 2 of 6 recovery milestones. Keep encouraging them!",
        type: 'recovery_progress',
        isRead: false,
        relatedStudent: student._id,
      },
      {
        recipient: student._id,
        title: 'High Risk Detected',
        message: 'Your academic performance has been flagged as High Risk. Reasons: Attendance: 68%, Assignment Completion: 50%, Quiz Average: 40%. Please follow your recovery path.',
        type: 'risk_flag',
        isRead: false,
      },
      {
        recipient: student._id,
        title: 'New Faculty Report',
        message: 'Dr. Priya Nair has submitted an academic concern report regarding your Data Structures performance.',
        type: 'faculty_report',
        relatedReport: facultyReport._id,
        isRead: false,
      },
      {
        recipient: faculty1._id,
        title: 'Report Acknowledged',
        message: "Parent has acknowledged the DBMS attendance report you submitted for Arun Kumar.",
        type: 'acknowledgement',
        relatedReport: facultyReport2._id,
        isRead: false,
      },
    ]);

    console.log('\n✅ Seed data created successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('DEMO LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════');
    console.log('Admin    : admin@edupulse.edu    / admin123');
    console.log('HoD      : hod@edupulse.edu      / hod123');
    console.log('Faculty  : faculty@edupulse.edu  / faculty123');
    console.log('Student  : student@edupulse.edu  / student123');
    console.log('Parent   : parent@edupulse.edu   / parent123');
    console.log('═══════════════════════════════════════\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
