import { defineStore } from 'pinia'

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: []
  }),
  
  getters: {
    publishedCourses: (state) => state.courses.filter(course => course.status === 'published'),
    draftCourses: (state) => state.courses.filter(course => course.status === 'draft'),
    archivedCourses: (state) => state.courses.filter(course => course.status === 'archived')
  },
  
  actions: {
    async fetchCourses() {
      try {
        // fecth from remote server
        const response = await fetch('/api/courses')
        if (!response.ok) throw new Error('Failed to fetch courses')
        const data = await response.json()
        this.courses = data
      } catch (error) {
        console.error('Error fetching courses:', error)
        // 如果获取失败，使用空数组
        this.courses = []
      }
    },
    
    async addCourse(course) {
      try {
        // fecth from remote server
        const response = await fetch('/api/courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(course)
        })
        if (!response.ok) throw new Error('Failed to add course')
        const newCourse = await response.json()
        this.courses.push(newCourse)
      } catch (error) {
        console.error('Error adding course:', error)
      }
    },
    
    async updateCourse(id, updatedCourse) {
      try {
        // fecth from remote server
        const response = await fetch(`/api/courses/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedCourse)
        })
        if (!response.ok) throw new Error('Failed to update course')
        const updated = await response.json()
        
        const index = this.courses.findIndex(course => course.id === id)
        if (index !== -1) {
          this.courses[index] = updated
        }
      } catch (error) {
        console.error('Error updating course:', error)
      }
    },
    
    async toggleCourseStatus(id) {
      try {
        const course = this.courses.find(c => c.id === id)
        if (!course) return
        
        let newStatus = ''
        const status = course.status
        if (status === 'published') {
          newStatus = 'archived'
        } else if (status === 'archived') {
          newStatus = 'published'
        } else {
          newStatus = 'published'
        }
        
        // fecth from remote server
        const response = await fetch(`/api/courses/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus })
        })
        if (!response.ok) throw new Error('Failed to toggle course status')
        
        const index = this.courses.findIndex(course => course.id === id)
        if (index !== -1) {
          this.courses[index].status = newStatus
        }
      } catch (error) {
        console.error('Error toggling course status:', error)
      }
    },
    
    async deleteCourse(id) {
      try {
        // fecth from remote server
        const response = await fetch(`/api/courses/${id}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to delete course')
        
        const index = this.courses.findIndex(course => course.id === id)
        if (index !== -1) {
          this.courses.splice(index, 1)
        }
      } catch (error) {
        console.error('Error deleting course:', error)
      }
    }
  }
})
