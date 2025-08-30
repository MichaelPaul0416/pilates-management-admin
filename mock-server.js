// 简单的Mock API服务器
// 用于演示从后端服务器获取数据的功能
// 运行: node mock-server.js

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 模拟数据
let courses = [
  {
    id: 1,
    name: '数学基础',
    description: '数学基础课程，涵盖代数、几何等内容',
    status: 'published',
    createdAt: '2023-01-15'
  },
  {
    id: 2,
    name: '英语口语',
    description: '提高英语口语表达能力',
    status: 'draft',
    createdAt: '2023-02-20'
  },
  {
    id: 3,
    name: '计算机科学导论',
    description: '计算机科学基础知识介绍',
    status: 'published',
    createdAt: '2023-03-10'
  },
  {
    id: 4,
    name: '物理原理',
    description: '物理学基本原理和实验',
    status: 'published',
    createdAt: '2023-04-05'
  },
  {
    id: 5,
    name: '化学实验',
    description: '化学实验基础和安全操作',
    status: 'published',
    createdAt: '2023-05-12'
  }
];

let schedules = [
  {
    id: 1,
    courseId: 1,
    courseName: '数学基础',
    date: '2023-09-15',
    time: '09:00-11:00',
    location: 'A101教室',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=数学&backgroundColor=0ea5e9'
  },
  {
    id: 2,
    courseId: 1,
    courseName: '数学基础',
    date: '2023-09-22',
    time: '09:00-11:00',
    location: 'A101教室',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=数学&backgroundColor=0ea5e9'
  },
  {
    id: 3,
    courseId: 3,
    courseName: '计算机科学导论',
    date: '2023-09-18',
    time: '14:00-16:00',
    location: 'B205教室',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=计算机&backgroundColor=8b5cf6'
  },
  {
    id: 4,
    courseId: 2,
    courseName: '英语口语',
    date: '2023-09-20',
    time: '10:00-12:00',
    location: 'C301教室',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=英语&backgroundColor=10b981'
  },
  {
    id: 5,
    courseId: 1,
    courseName: '数学基础',
    date: '2023-09-25',
    time: '13:00-15:00',
    location: 'A101教室',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=数学&backgroundColor=0ea5e9'
  },
  {
    id: 6,
    courseId: 4,
    courseName: '物理原理',
    date: '2025-08-28',
    time: '09:00-11:00',
    location: 'D101教室',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=物理&backgroundColor=f59e0b'
  },
  {
    id: 7,
    courseId: 5,
    courseName: '化学实验',
    date: '2025-08-29',
    time: '14:00-16:00',
    location: 'E205实验室',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=化学&backgroundColor=ef4444'
  },
  {
    id: 8,
    courseId: 3,
    courseName: '计算机科学导论',
    date: '2025-08-27',
    time: '10:00-12:00',
    location: 'B205教室',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=计算机&backgroundColor=8b5cf6'
  }
];

// 课程API路由
app.get('/api/courses', (req, res) => {
  console.log('GET /api/courses - Fetching all courses');
  res.json(courses);
});

app.post('/api/courses', (req, res) => {
  console.log('POST /api/courses - Adding new course:', req.body);
  const newCourse = {
    id: courses.length + 1,
    ...req.body,
    createdAt: new Date().toISOString().split('T')[0]
  };
  courses.push(newCourse);
  res.json(newCourse);
});

app.put('/api/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`PUT /api/courses/${id} - Updating course:`, req.body);
  const index = courses.findIndex(course => course.id === id);
  if (index !== -1) {
    courses[index] = { ...courses[index], ...req.body };
    res.json(courses[index]);
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

app.patch('/api/courses/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`PATCH /api/courses/${id}/status - Updating status:`, req.body);
  const index = courses.findIndex(course => course.id === id);
  if (index !== -1) {
    courses[index].status = req.body.status;
    res.json(courses[index]);
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

app.delete('/api/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`DELETE /api/courses/${id} - Deleting course`);
  const index = courses.findIndex(course => course.id === id);
  if (index !== -1) {
    const deletedCourse = courses.splice(index, 1)[0];
    res.json(deletedCourse);
  } else {
    res.status(404).json({ error: 'Course not found' });
  }
});

// 课时API路由
app.get('/api/schedules', (req, res) => {
  console.log('GET /api/schedules - Fetching all schedules');
  res.json(schedules);
});

app.post('/api/schedules', (req, res) => {
  console.log('POST /api/schedules - Adding new schedule:', req.body);
  const newSchedule = {
    id: schedules.length + 1,
    ...req.body
  };
  schedules.push(newSchedule);
  res.json(newSchedule);
});

app.put('/api/schedules/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`PUT /api/schedules/${id} - Updating schedule:`, req.body);
  const index = schedules.findIndex(schedule => schedule.id === id);
  if (index !== -1) {
    schedules[index] = { ...schedules[index], ...req.body };
    res.json(schedules[index]);
  } else {
    res.status(404).json({ error: 'Schedule not found' });
  }
});

app.delete('/api/schedules/:id', (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`DELETE /api/schedules/${id} - Deleting schedule`);
  const index = schedules.findIndex(schedule => schedule.id === id);
  if (index !== -1) {
    const deletedSchedule = schedules.splice(index, 1)[0];
    res.json(deletedSchedule);
  } else {
    res.status(404).json({ error: 'Schedule not found' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET    /api/courses');
  console.log('  POST   /api/courses');
  console.log('  PUT    /api/courses/:id');
  console.log('  PATCH  /api/courses/:id/status');
  console.log('  DELETE /api/courses/:id');
  console.log('  GET    /api/schedules');
  console.log('  POST   /api/schedules');
  console.log('  PUT    /api/schedules/:id');
  console.log('  DELETE /api/schedules/:id');
});
