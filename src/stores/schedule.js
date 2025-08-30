import { defineStore } from 'pinia'

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    schedules: []
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
    async fetchSchedules() {
      try {
        // fecth from remote server
        const response = await fetch('/api/schedules')
        if (!response.ok) throw new Error('Failed to fetch schedules')
        const data = await response.json()
        this.schedules = data
      } catch (error) {
        console.error('Error fetching schedules:', error)
        // 如果获取失败，使用空数组
        this.schedules = []
      }
    },
    
    async addSchedule(schedule) {
      try {
        // fecth from remote server
        const response = await fetch('/api/schedules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(schedule)
        })
        if (!response.ok) throw new Error('Failed to add schedule')
        const newSchedule = await response.json()
        this.schedules.push(newSchedule)
      } catch (error) {
        console.error('Error adding schedule:', error)
      }
    },
    
    async updateSchedule(id, updatedSchedule) {
      try {
        // fecth from remote server
        const response = await fetch(`/api/schedules/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedSchedule)
        })
        if (!response.ok) throw new Error('Failed to update schedule')
        const updated = await response.json()
        
        const index = this.schedules.findIndex(schedule => schedule.id === id)
        if (index !== -1) {
          this.schedules[index] = updated
        }
      } catch (error) {
        console.error('Error updating schedule:', error)
      }
    },
    
    async deleteSchedule(id) {
      try {
        // fecth from remote server
        const response = await fetch(`/api/schedules/${id}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to delete schedule')
        
        const index = this.schedules.findIndex(schedule => schedule.id === id)
        if (index !== -1) {
          this.schedules.splice(index, 1)
        }
      } catch (error) {
        console.error('Error deleting schedule:', error)
      }
    }
  }
})
