import { defineStore } from 'pinia'

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: [
      {
        id: 1,
        name: '数学基础',
        description: '数学基础课程，涵盖代数、几何等内容',
        status: 'published', // published, draft, archived
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
    ]
  }),
  
  getters: {
    publishedCourses: (state) => state.courses.filter(course => course.status === 'published'),
    draftCourses: (state) => state.courses.filter(course => course.status === 'draft'),
    archivedCourses: (state) => state.courses.filter(course => course.status === 'archived')
  },
  
  actions: {
    addCourse(course) {
      const newCourse = {
        id: this.courses.length + 1,
        ...course,
        createdAt: new Date().toISOString().split('T')[0]
      }
      this.courses.push(newCourse)
    },
    
    updateCourse(id, updatedCourse) {
      const index = this.courses.findIndex(course => course.id === id)
      if (index !== -1) {
        this.courses[index] = { ...this.courses[index], ...updatedCourse }
      }
    },
    
    toggleCourseStatus(id) {
      const index = this.courses.findIndex(course => course.id === id)
      if (index !== -1) {
        const status = this.courses[index].status
        if (status === 'published') {
          this.courses[index].status = 'archived'
        } else if (status === 'archived') {
          this.courses[index].status = 'published'
        } else {
          this.courses[index].status = 'published'
        }
      }
    },
    
    deleteCourse(id) {
      const index = this.courses.findIndex(course => course.id === id)
      if (index !== -1) {
        this.courses.splice(index, 1)
      }
    }
  }
})