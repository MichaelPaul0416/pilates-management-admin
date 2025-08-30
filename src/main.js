import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(router)
app.use(createPinia())

// 挂载应用
app.mount('#app')