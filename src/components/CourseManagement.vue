<template>
  <div>
    <n-card title="课程管理">
      <template #header-extra>
        <n-button type="primary" @click="showCreateModal = true">
          新增课程
        </n-button>
      </template>
      
      <n-tabs type="segment" v-model="activeTab">
        <n-tab name="all">全部课程</n-tab>
        <n-tab name="published">已发布</n-tab>
        <n-tab name="draft">草稿</n-tab>
        <n-tab name="archived">已下架</n-tab>
      </n-tabs>
      
      <n-data-table
        :columns="columns"
        :data="filteredCourses"
        :pagination="pagination"
        style="margin-top: 20px;"
      />
    </n-card>
    
    <!-- 新增/编辑课程模态框 -->
    <n-modal v-model:show="showCreateModal" preset="card" style="width: 600px;">
      <template #header>
        <div>{{ isEditing ? '编辑课程' : '新增课程' }}</div>
      </template>
      <n-form
        :model="courseForm"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        label-width="80"
      >
        <n-form-item label="课程名称" path="name">
          <n-input v-model="courseForm.name" placeholder="请输入课程名称" />
        </n-form-item>
        <n-form-item label="课程描述" path="description">
          <n-input
            v-model="courseForm.description"
            placeholder="请输入课程描述"
            type="textarea"
            :autosize="{ minRows: 3 }"
          />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-select
            v-model="courseForm.status"
            :options="statusOptions"
            placeholder="请选择课程状态"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showCreateModal = false">取消</n-button>
          <n-button type="primary" @click="handleSubmit">{{ isEditing ? '更新' : '创建' }}</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, reactive, h, onMounted } from 'vue'
import { useCourseStore } from '../stores/course'
import { NCard, NButton, NTabs, NTab, NDataTable, NModal, NForm, NFormItem, 
         NInput, NSelect, NSpace, NTag } from 'naive-ui'

// 状态管理
const courseStore = useCourseStore()

// 组件挂载时获取课程数据
onMounted(async () => {
  // fecth from remote server
  await courseStore.fetchCourses()
})

// 表格配置
const columns = [
  {
    title: '课程名称',
    key: 'name'
  },
  {
    title: '描述',
    key: 'description'
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      const statusMap = {
        published: { text: '已发布', type: 'success' },
        draft: { text: '草稿', type: 'warning' },
        archived: { text: '已下架', type: 'error' }
      }
      const status = statusMap[row.status] || { text: '未知', type: 'default' }
      return h(NTag, { type: status.type }, { default: () => status.text })
    }
  },
  {
    title: '创建时间',
    key: 'createdAt'
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(NSpace, {}, {
        default: () => [
          h(NButton, {
            size: 'small',
            onClick: () => editCourse(row)
          }, { default: () => '编辑' }),
          h(NButton, {
            size: 'small',
            type: row.status === 'published' ? 'error' : 'success',
            onClick: () => toggleStatus(row.id)
          }, { 
            default: () => row.status === 'published' ? '下架' : 
                      row.status === 'archived' ? '上架' : '发布' 
          }),
          h(NButton, {
            size: 'small',
            type: 'error',
            onClick: () => deleteCourse(row.id)
          }, { default: () => '删除' })
        ]
      })
    }
  }
]

// 分页配置
const pagination = {
  pageSize: 10
}

// 状态选项
const statusOptions = [
  { label: '已发布', value: 'published' },
  { label: '草稿', value: 'draft' },
  { label: '已下架', value: 'archived' }
]

// 模态框相关
const showCreateModal = ref(false)
const isEditing = ref(false)
const editingId = ref(null)

// 表单数据
const courseForm = reactive({
  name: '',
  description: '',
  status: 'draft'
})

// 表单验证规则
const rules = {
  name: {
    required: true,
    message: '请输入课程名称',
    trigger: 'blur'
  },
  description: {
    required: true,
    message: '请输入课程描述',
    trigger: 'blur'
  },
  status: {
    required: true,
    message: '请选择课程状态',
    trigger: 'change'
  }
}

// 表单引用
const formRef = ref(null)

// 活动标签页
const activeTab = ref('all')

// 过滤后的课程数据
const filteredCourses = computed(() => {
  if (activeTab.value === 'all') return courseStore.courses
  return courseStore.courses.filter(course => course.status === activeTab.value)
})

// 提交表单
const handleSubmit = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      if (isEditing.value) {
        courseStore.updateCourse(editingId.value, { ...courseForm })
      } else {
        courseStore.addCourse({ ...courseForm })
      }
      showCreateModal.value = false
      resetForm()
    }
  })
}

// 重置表单
const resetForm = () => {
  Object.assign(courseForm, {
    name: '',
    description: '',
    status: 'draft'
  })
  isEditing.value = false
  editingId.value = null
}

// 编辑课程
const editCourse = (course) => {
  isEditing.value = true
  editingId.value = course.id
  Object.assign(courseForm, {
    name: course.name,
    description: course.description,
    status: course.status
  })
  showCreateModal.value = true
}

// 切换课程状态
const toggleStatus = (id) => {
  courseStore.toggleCourseStatus(id)
}

// 删除课程
const deleteCourse = (id) => {
  courseStore.deleteCourse(id)
}
</script>
