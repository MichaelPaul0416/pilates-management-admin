<template>
  <div>
    <n-card title="课时安排">
      <CustomCalendar 
        v-model="selectedDate" 
        @date-selected="handleDateSelect"
        @schedule-clicked="handleScheduleClick"
        @add-schedule="handleAddSchedule"
      />
      
      <n-card title="当日课时安排" style="margin-top: 20px;">
        <template #header-extra>
          <n-button type="primary" @click="showScheduleModal = true">
            添加课时
          </n-button>
        </template>
        
        <n-list v-if="dailySchedules.length > 0">
          <n-list-item v-for="schedule in dailySchedules" :key="schedule.id">
            <n-thing>
              <template #header>
                {{ schedule.courseName }}
              </template>
              <template #description>
                <n-space>
                  <n-tag>{{ schedule.time }}</n-tag>
                  <n-tag type="info">{{ schedule.location }}</n-tag>
                </n-space>
              </template>
            </n-thing>
            <template #suffix>
              <n-space>
                <n-button text @click="editSchedule(schedule)">
                  <n-icon><Edit /></n-icon>
                </n-button>
                <n-button text @click="deleteSchedule(schedule.id)">
                  <n-icon><Trash /></n-icon>
                </n-button>
              </n-space>
            </template>
          </n-list-item>
        </n-list>
        
        <n-empty v-else description="当天没有课时安排" />
      </n-card>
    </n-card>
    
    <!-- 课程详情模态框 -->
    <n-modal 
      v-model:show="showDetailModal" 
      preset="card" 
      style="width: 500px; border-radius: 16px; overflow: hidden;"
      :style="{ '--n-border-radius': '16px' }"
    >
      <template #header>
        <div style="font-size: 20px; font-weight: 600; color: #2d5a7a; padding: 8px 0;">
          课程详情
        </div>
      </template>
      
      <div style="padding: 20px 0;">
        <div style="display: flex; align-items: center; margin-bottom: 24px; padding: 16px; background: linear-gradient(135deg, #f0f9f4 0%, #e6f7ee 100%); border-radius: 12px; border: 1px solid #d4ede0;">
          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #18a058 0%, #0e8a47 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px; box-shadow: 0 4px 8px rgba(24, 160, 88, 0.2);">
            <span style="color: white; font-size: 20px; font-weight: bold;">
              {{ selectedSchedule?.courseName?.charAt(0) || '课' }}
            </span>
          </div>
          <div>
            <div style="font-size: 18px; font-weight: 600; color: #2d5a7a; margin-bottom: 4px;">
              {{ selectedSchedule?.courseName }}
            </div>
            <div style="font-size: 14px; color: #18a058; font-weight: 500;">
              课程安排详情
            </div>
          </div>
        </div>

        <div style="display: grid; gap: 16px;">
          <div style="display: flex; align-items: center; padding: 12px 16px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #18a058;">
            <div style="width: 32px; height: 32px; background: #e6f7ee; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
              <span style="color: #18a058; font-size: 16px;">📅</span>
            </div>
            <div>
              <div style="font-size: 12px; color: #666; margin-bottom: 2px;">日期</div>
              <div style="font-size: 14px; font-weight: 500; color: #333;">{{ selectedSchedule?.date }}</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; padding: 12px 16px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #18a058;">
            <div style="width: 32px; height: 32px; background: #e6f7ee; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
              <span style="color: #18a058; font-size: 16px;">⏰</span>
            </div>
            <div>
              <div style="font-size: 12px; color: #666; margin-bottom: 2px;">时间</div>
              <div style="font-size: 14px; font-weight: 500; color: #333;">{{ selectedSchedule?.time }}</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; padding: 12px 16px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #18a058;">
            <div style="width: 32px; height: 32px; background: #e6f7ee; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
              <span style="color: #18a058; font-size: 16px;">📍</span>
            </div>
            <div>
              <div style="font-size: 12px; color: #666; margin-bottom: 2px;">地点</div>
              <div style="font-size: 14px; font-weight: 500; color: #333;">{{ selectedSchedule?.location }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showDetailModal = false">关闭</n-button>
        </n-space>
      </template>
    </n-modal>
    
    <!-- 添加/编辑课时模态框 -->
    <n-modal v-model:show="showScheduleModal" preset="card" style="width: 600px;">
      <template #header>
        <div>{{ isEditingSchedule ? '编辑课时' : '添加课时' }}</div>
      </template>
      <n-form
        :model="scheduleForm"
        :rules="scheduleRules"
        ref="scheduleFormRef"
        label-placement="left"
        label-width="80"
      >
        <n-form-item label="课程" path="courseId">
          <n-select
            v-model:value="scheduleForm.courseId"
            :options="courseOptions"
            placeholder="请选择课程"
            label-field="name"
            value-field="id"
          />
        </n-form-item>
        <n-form-item label="日期" path="date">
          <n-date-picker
            v-model:value="scheduleForm.date"
            type="date"
            placeholder="请选择日期"
          />
        </n-form-item>
        <n-form-item label="开始时间" path="startTime">
          <n-select
            v-model:value="scheduleForm.startTime"
            :options="timeOptions"
            placeholder="请选择开始时间"
          />
        </n-form-item>
        <n-form-item label="结束时间" path="endTime">
          <n-select
            v-model:value="scheduleForm.endTime"
            :options="timeOptions"
            placeholder="请选择结束时间"
          />
        </n-form-item>
        <n-form-item label="地点" path="location">
          <n-input
            v-model:value="scheduleForm.location"
            placeholder="请输入上课地点"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showScheduleModal = false">取消</n-button>
          <n-button type="primary" @click="handleScheduleSubmit">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useCourseStore } from '../stores/course'
import { useScheduleStore } from '../stores/schedule'
import { NCard, NButton, NSpace, NList, NListItem, NThing, 
         NTag, NEmpty, NModal, NForm, NFormItem, NSelect, NDatePicker, 
         NInput, NIcon, NDescriptions, NDescriptionsItem } from 'naive-ui'
import { CreateOutline as Edit, TrashOutline as Trash } from '@vicons/ionicons5'
import CustomCalendar from './CustomCalendar.vue'

// 状态管理
const courseStore = useCourseStore()
const scheduleStore = useScheduleStore()

// 日期相关
const selectedDate = ref(Date.now())

// 课程选项
const courseOptions = computed(() => {
  return courseStore.publishedCourses.map(course => ({
    name: course.name,
    id: course.id
  }))
})

// 当日课时安排
const dailySchedules = computed(() => {
  const dateStr = formatDate(new Date(selectedDate.value))
  return scheduleStore.schedules.filter(schedule => schedule.date === dateStr)
})

// 时间选项（半小时间隔）
const timeOptions = computed(() => {
  const options = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      options.push({
        label: time,
        value: time
      })
    }
  }
  return options
})

// 格式化日期为 YYYY-MM-DD 格式
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 模态框相关
const showScheduleModal = ref(false)
const showDetailModal = ref(false)
const isEditingSchedule = ref(false)
const editingScheduleId = ref(null)
const selectedSchedule = ref(null)

// 表单数据
const scheduleForm = reactive({
  courseId: null,
  date: null,
  startTime: null,
  endTime: null,
  location: ''
})

function checkEmpty(rule,value,errorMsg){
  if(value == null || value == ''){
    return new Error(errorMsg);
  }
  return true;
}

// 表单验证规则
const scheduleRules = {
  courseId: {
    required: true,
    trigger: 'change',
    validator(rule,value){
      return checkEmpty(rule,value,'请选择课程！');
    }
  },
  date: {
    required: true,
    trigger: 'change',
    validator(rule,value){
      return checkEmpty(rule,value,'请选择日期！');
    }
  },
  startTime: {
    required: true,
    trigger: 'change',
    validator(rule,value){
      if(value == null || '' ==  value){
        return new Error('请选择开始时间！');
      }else{
        if(value > scheduleForm.endTime){
          return new Error("开始时间不能晚于结束时间！");
        }
        return true;
      }
    }
  },
  endTime: {
    required: true,
    trigger: 'change',
    validator(rule,value){
      if(value == null || '' == value){
        return new Error('请选择结束时间！');
      }else{
        if(value < scheduleForm.startTime){
          return new Error('结束时间不能早于开始时间！');
        }
        return true;
      }
    }
  },
  location: {
    required: true,
    trigger: 'blur',
    validator(rule,value){
      return checkEmpty(rule,value,'请输入上课地点！');
    }
  }
}

// 表单引用
const scheduleFormRef = ref(null)

// 提交课时表单
const handleScheduleSubmit = () => {
  scheduleFormRef.value?.validate((errors) => {
    if (!errors) {
      const course = courseStore.courses.find(c => c.id === scheduleForm.courseId)
      const timeRange = `${scheduleForm.startTime}-${scheduleForm.endTime}`
      const formData = {
        ...scheduleForm,
        time: timeRange,
        courseName: course?.name || '',
        date: formatDate(new Date(scheduleForm.date))
      }
      // 删除startTime和endTime字段，因为它们不在schedule数据结构中
      delete formData.startTime
      delete formData.endTime
      
      if (isEditingSchedule.value) {
        scheduleStore.updateSchedule(editingScheduleId.value, formData)
      } else {
        scheduleStore.addSchedule(formData)
      }
      
      showScheduleModal.value = false
      resetScheduleForm()
    }
  })
}

// 重置课时表单
const resetScheduleForm = () => {
  Object.assign(scheduleForm, {
    courseId: null,
    date: null,
    startTime: null,
    endTime: null,
    location: ''
  })
  isEditingSchedule.value = false
  editingScheduleId.value = null
}

// 编辑课时
const editSchedule = (schedule) => {
  isEditingSchedule.value = true
  editingScheduleId.value = schedule.id
  // 解析时间范围
  const timeParts = schedule.time.split('-')
  const startTime = timeParts[0] || null
  const endTime = timeParts[1] || null
  
  Object.assign(scheduleForm, {
    courseId: schedule.courseId,
    date: new Date(schedule.date).getTime(),
    startTime: startTime,
    endTime: endTime,
    location: schedule.location
  })
  showScheduleModal.value = true
}

// 删除课时
const deleteSchedule = (id) => {
  scheduleStore.deleteSchedule(id)
}

// 日期选择处理
// 当用户点击日历中的某个日期时，此方法会被调用
// 它会设置选中的日期，并打开添加课时的模态框，同时将表单中的日期设置为用户选择的日期
const handleDateSelect = (date) => {
  selectedDate.value = date.getTime()
  // 重置表单为添加模式
  resetScheduleForm()
  // 设置表单日期为用户选择的日期
  scheduleForm.date = date.getTime()
  // 打开当天的课程安排弹窗
  // showScheduleModal.value = true
}

// 处理课程点击
const handleScheduleClick = (schedule) => {
  selectedSchedule.value = schedule
  showDetailModal.value = true
}

// 处理添加课时安排
const handleAddSchedule = (date) => {
  // 重置表单为添加模式
  resetScheduleForm()
  // 设置表单日期为用户选择的日期
  scheduleForm.date = date.getTime()
  // 打开添加课时安排的模态框
  showScheduleModal.value = true
}
</script>
