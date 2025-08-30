import { createRouter, createWebHistory } from 'vue-router'
import CourseManagement from './components/CourseManagement.vue'
import ScheduleManagement from './components/ScheduleManagement.vue'

const routes = [
  {
    path: '/',
    redirect: '/courses'
  },
  {
    path: '/courses',
    name: 'courses',
    component: CourseManagement
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: ScheduleManagement
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router