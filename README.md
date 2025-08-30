# 课程管理系统

一个基于Vue 3 + Naive UI + Pinia的课程管理系统，支持课程管理和课时安排功能。

## 功能特性

- 📚 课程管理：添加、编辑、删除课程，支持多种状态（已发布、草稿、已下架）
- 📅 课时安排：可视化日历展示，支持添加、编辑、删除课时
- 🎨 主题切换：支持浅色/深色主题切换
- 🌐 后端集成：所有数据从后端服务器获取

## 技术栈

- **前端框架**: Vue 3
- **UI组件库**: Naive UI
- **状态管理**: Pinia
- **路由**: Vue Router
- **构建工具**: Vite
- **后端**: Express.js (Mock Server)

## 项目结构

```
src/
├── components/          # 组件
│   ├── CourseManagement.vue    # 课程管理组件
│   ├── ScheduleManagement.vue  # 课时安排组件
│   └── CustomCalendar.vue      # 自定义日历组件
├── stores/              # Pinia状态管理
│   ├── course.js        # 课程状态管理
│   └── schedule.js      # 课时状态管理
├── App.vue              # 根组件
├── main.js              # 入口文件
└── router.js            # 路由配置
```

## 后端API集成

### 课程API
- `GET /api/courses` - 获取所有课程
- `POST /api/courses` - 创建新课程
- `PUT /api/courses/:id` - 更新课程
- `PATCH /api/courses/:id/status` - 更新课程状态
- `DELETE /api/courses/:id` - 删除课程

### 课时API
- `GET /api/schedules` - 获取所有课时安排
- `POST /api/schedules` - 创建新课时
- `PUT /api/schedules/:id` - 更新课时
- `DELETE /api/schedules/:id` - 删除课时

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

1. 启动Mock API服务器：
```bash
npm run mock-server
```

2. 启动前端开发服务器：
```bash
npm run dev
```

3. 打开浏览器访问：http://localhost:3000

## 使用说明

### 课程管理
1. 点击"课程管理"菜单进入课程管理页面
2. 可以查看所有课程，按状态筛选
3. 点击"新增课程"按钮添加新课程
4. 点击课程行中的操作按钮进行编辑、状态切换或删除

### 课时安排
1. 点击"课时安排"菜单进入课时安排页面
2. 日历视图显示所有课时安排
3. 点击日期可以查看当天的课时安排
4. 点击"+"按钮或"添加课时"按钮添加新课时
5. 点击课时卡片查看详情或进行编辑

## 开发说明

### 后端集成修改点

所有数据获取都已改为从后端服务器获取，主要修改包括：

1. **Pinia Store修改**：
   - `src/stores/course.js` - 添加了异步API调用
   - `src/stores/schedule.js` - 添加了异步API调用

2. **组件修改**：
   - 所有组件在`onMounted`生命周期钩子中调用`fetchCourses()`或`fetchSchedules()`
   - 每个API调用都添加了注释：`// fecth from remote server`

3. **配置修改**：
   - `vite.config.js` - 添加了代理配置，将`/api`请求转发到Mock服务器
   - `package.json` - 添加了`mock-server`脚本

### 自定义后端

要使用真实的后端服务器，只需修改以下文件中的API端点：

- `src/stores/course.js` - 修改所有`fetch`调用的URL
- `src/stores/schedule.js` - 修改所有`fetch`调用的URL
- `vite.config.js` - 修改代理配置指向真实后端地址

## 注意事项

- Mock服务器使用端口3001，前端开发服务器使用端口3000
- 所有API调用都有错误处理，如果后端不可用会显示空数据
- 当前使用Mock数据，生产环境需要替换为真实后端API
