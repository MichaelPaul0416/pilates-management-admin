import { defineStore } from 'pinia'

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    schedules: [
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
      // 添加一些接近当前日期的示例数据
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
    ]
  }),
  
  getters: {
    getSchedulesByCourseId: (state) => (courseId) => {
      return state.schedules.filter(schedule => schedule.courseId === courseId)
    },
    getSchedulesByDate: (state) => (date) => {
      return state.schedules.filter(schedule => schedule.date === date)
    }
  },
  
  actions: {
    addSchedule(schedule) {
      const newSchedule = {
        id: this.schedules.length + 1,
        ...schedule
      }
      this.schedules.push(newSchedule)
    },
    
    updateSchedule(id, updatedSchedule) {
      const index = this.schedules.findIndex(schedule => schedule.id === id)
      if (index !== -1) {
        this.schedules[index] = { ...this.schedules[index], ...updatedSchedule }
      }
    },
    
    deleteSchedule(id) {
      const index = this.schedules.findIndex(schedule => schedule.id === id)
      if (index !== -1) {
        this.schedules.splice(index, 1)
      }
    }
  }
})
