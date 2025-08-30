<template>
  <n-config-provider :theme="theme">
    <n-layout style="min-height: 100vh;">
      <n-layout-header bordered style="height: 90px;">
        <div class="header">
          <h2>课程管理系统</h2>
          <n-space>
            <n-button @click="toggleTheme">
              {{ theme === null ? '深色' : '浅色' }}
            </n-button>
          </n-space>
        </div>
      </n-layout-header>
      <n-layout has-sider>
        <n-layout-sider 
          bordered 
          collapse-mode="width" 
          :collapsed-width="64" 
          :width="240"
          show-trigger="bar"
        >
          <n-menu
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            :value="currentRoute"
            @update:value="handleMenuSelect"
          />
        </n-layout-sider>
        <n-layout-content style="padding: 20px;">
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NConfigProvider, NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, 
         NMenu, NButton, NSpace } from 'naive-ui'
import { Moon, Sunny } from '@vicons/ionicons5'

// 主题切换
const theme = ref(null)
const toggleTheme = () => {
  theme.value = theme.value === null ? 'dark' : null
}

// 菜单选项
const menuOptions = [
  {
    label: '课程管理',
    key: 'courses'
  },
  {
    label: '课时安排',
    key: 'schedule'
  }
]

// 路由
const router = useRouter()
const route = useRoute()
const currentRoute = computed(() => route.name)

// 菜单点击处理
const handleMenuSelect = (key, item) => {
  console.log('Menu selected:', key)
  if (key === 'courses') {
    router.push('/courses')
  } else if (key === 'schedule') {
    router.push('/schedule')
  }
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.n-layout-header {
  height: 64px;
}
</style>