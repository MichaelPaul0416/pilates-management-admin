<template>
  <div class="custom-calendar">
    <div class="calendar-header">
      <button class="nav-button" @click="prevMonth">&lt;</button>
      <div class="month-year">{{ formatMonthYear(currentDate) }}</div>
      <button class="nav-button" @click="nextMonth">&gt;</button>
    </div>
    <div class="calendar-grid">
      <div class="weekdays">
        <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
      </div>
      <div class="days-grid">
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index"
          class="day-cell"
          :class="{ 
            'current-month': day.isCurrentMonth,
            'today': day.isToday,
            'selected': day.date.getTime() === selectedDate.getTime(),
            'past-date': isPastDate(day.date)
          }"
          @click="handleDateClick(day.date)"
        >
          <div class="day-number">{{ day.date.getDate() }}</div>
          <div class="day-schedules">
            <div 
              v-for="schedule in day.schedules" 
              :key="schedule.id"
              class="schedule-item"
              @click.stop="showScheduleDetail(schedule)"
            >
              <img :src="schedule.avatar" :alt="schedule.courseName" class="schedule-avatar" />
              <div class="schedule-content">
                <span class="schedule-course">{{ schedule.courseName }}</span>
                <span class="schedule-time">{{ schedule.time }}</span>
              </div>
            </div>
          </div>
          <div 
            v-if="isFutureDate(day.date) || day.isToday" 
            class="add-schedule-btn"
            @click.stop="addSchedule(day.date)"
          >
            +
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useScheduleStore } from '../stores/schedule'

const props = defineProps({
  modelValue: {
    type: Number,
    default: Date.now()
  }
})

const emit = defineEmits(['update:modelValue', 'date-selected', 'add-schedule'])

const scheduleStore = useScheduleStore()
const selectedDate = ref(new Date(props.modelValue))
const currentDate = ref(new Date(props.modelValue))
console.info('-------------selectedDate-------------', selectedDate.value)

// 组件挂载时获取课时数据
onMounted(async () => {
  // fecth from remote server
  await scheduleStore.fetchSchedules()
})

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 格式化月份和年份
const formatMonthYear = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  return `${year}年${month}月`
}

// 生成日历天数
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // 获取当月第一天和最后一天
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // 获取第一天是星期几（0-6，0表示星期日）
  const firstDayOfWeek = firstDay.getDay()
  
  // 获取上个月的最后一天
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  
  // 生成日历天数数组
  const days = []
  
  // 添加上个月的日期
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      schedules: getSchedulesForDate(date)
    })
  }
  
  // 添加当前月的日期
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isToday(date),
      schedules: getSchedulesForDate(date)
    })
  }
  
  // 添加下个月的日期，确保总共有42天（6行7列）
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      schedules: getSchedulesForDate(date)
    })
  }
  
  return days
})

// 检查日期是否是今天
const isToday = (date) => {
  const today = new Date()
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear()
}

// 检查日期是否早于今天
const isPastDate = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)
  return compareDate < today
}

// 检查日期是否是未来日期
const isFutureDate = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)
  return compareDate > today
}

// 获取指定日期的课程安排
const getSchedulesForDate = (date) => {
  const dateStr = formatDate(date)
  return scheduleStore.schedules.filter(schedule => schedule.date === dateStr)
}

// 格式化日期为 YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 上一个月
const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

// 下一个月
const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

// 选择日期
const handleSelectDate = (date) => {
  selectedDate.value = date
  emit('update:modelValue', date.getTime())
  emit('date-selected', date)
}

// 处理日期点击事件
const handleDateClick = (date) => {
  // 点击日期时选择该日期
  handleSelectDate(date)
  console.info('Selected date timestamp:', date.getTime())
  console.info('Selected date object:', selectedDate.value)
}

// 添加课时安排
const addSchedule = (date) => {
  // 触发事件，让父组件显示添加课时安排的模态框
  emit('add-schedule', date)
}

// 显示课程详情
const showScheduleDetail = (schedule) => {
  // 这里可以触发一个事件，让父组件显示详情模态框
  emit('schedule-clicked', schedule)
}

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const newDate = new Date(newValue)
    selectedDate.value = newDate
    currentDate.value = newDate
  }
})
</script>

<style scoped>
.custom-calendar {
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  border-bottom: 1px solid #e0e0e0;
}

.nav-button { 
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #333;
  font-weight: bold;
}

.nav-button:hover {
  background-color: #18a058;
  color: white;
  transform: scale(1.1);
}

.month-year {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  letter-spacing: 0.5px;
}

.calendar-grid {
  padding: 20px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  color: #18a058;
  margin-bottom: 12px;
  font-size: 15px;
}

.weekday {
  padding: 12px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day-cell {
  min-height: 110px;
  background-color: #fff;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border-radius: 8px;
  border: 1px solid #eef2f7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
}

.day-cell:hover {
  background-color: #f0f9f4;
  border-color: #18a058;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(24, 160, 88, 0.15);
}

.day-cell:not(.current-month) {
  background-color: #fafafa;
  color: #bbb;
  opacity: 0.7;
}

.day-cell.today {
  background-color: #fff;
}

.day-cell.today .day-number {
  font-weight: bold;
  color: white;
  background-color: #18a058;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin: 0 auto 6px auto;
}

.day-cell.selected {
  background-color: #fff;
  border: 2px solid #18a058;
  box-shadow: 0 0 0 2px rgba(24, 160, 88, 0.3);
}

.day-cell.past-date {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.day-cell.past-date .day-number {
  color: #999;
}

.day-cell.past-date:hover {
  background-color: #f5f5f5;
  transform: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  border-color: #eef2f7;
  cursor: not-allowed;
}

.add-schedule-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background-color: #f0f0f0;
  color: #cccccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #dddddd;
  line-height: 1;
  text-align: center;
}

.add-schedule-btn:hover {
  background-color: #18a058;
  color: white;
  transform: scale(1.1);
}

.day-number {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
  display: flex;
  justify-content: center;
}

.day-schedules {
  font-size: 12px;
  max-height: 75px;
  overflow-y: auto;
  padding-right: 4px;
}

.day-schedules::-webkit-scrollbar {
  width: 4px;
}

.day-schedules::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.day-schedules::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.day-schedules::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.schedule-item {
  background-color: #f0f9f4;
  border-radius: 6px;
  padding: 5px 8px;
  margin-bottom: 5px;
  cursor: pointer;
  border: 1px solid #d4ede0;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
}

.schedule-item:hover {
  background-color: #e6f7ee;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.schedule-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  /* background-color: #18a058; */
  flex-shrink: 0;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  padding: 1px;
}

.schedule-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.schedule-course {
  font-weight: 600;
  color: #2d5a7a;
  font-size: 11px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.schedule-time {
  color: #18a058;
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
