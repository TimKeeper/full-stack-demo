# 全栈开发实施路径规划 (Implementation Plan)

本文档旨在梳理从零构建前后端分离管理系统的完整链路，防止开发过程中迷失方向。我们将采用 **“后端先行，API 驱动，前端集成”** 的标准研发模式。

---

## 📅 Phase 1: 后端基础设施建设 (Backend Infrastructure)

**目标**: 让 NestJS 成功连接 MySQL，并建立统一的配置管理。

- [x] **1.1 环境配置管理**
  - 安装 `@nestjs/config`。
  - 创建根目录 `.env` 文件（统一管理 DB 密码、端口等敏感信息）。
  - 配置 NestJS 读取 `.env`。
- [x] **1.2 数据库连接层 (TypeORM)**
  - 安装 `@nestjs/typeorm` `typeorm` `mysql2`。
  - 在 `AppModule` 中配置 `TypeOrmModule`，连接 Docker 中的 MySQL 容器。
  - **验证标准**: 启动 NestJS 不报错，且数据库中自动生成表结构（`synchronize: true` 模式）。
- [x] **1.3 统一响应格式 (Interceptors)**
  - 封装全局 Response Interceptor，确保所有接口返回统一结构 `{ code: 200, data: ..., message: "success" }`。
  - 封装全局 Exception Filter，统一处理 HTTP 异常。

---

## ⚙️ Phase 2: 后端业务逻辑开发 (Business Logic)

**目标**: 完成“用户管理”模块的 CRUD 接口，并生成 API 文档。

- [x] **2.1 创建 User 模块**
  - 使用 CLI 生成 Module, Controller, Service。
  - 定义 `User` Entity (id, username, password, nickname, created_at)。
- [x] **2.2 实现 CRUD 接口**
  - `POST /users`: 创建用户
  - `GET /users`: 获取用户列表 (分页)
  - `GET /users/:id`: 获取详情
  - `patch /users/:id`: 更新信息
  - `DELETE /users/:id`: 删除用户
- [x] **2.3 API 文档化 (Swagger)**
  - 集成 `@nestjs/swagger`。
  - 为所有接口添加 DTO (Data Transfer Object) 验证和文档注释。
  - **验证标准**: 打开 `http://localhost:3000/api` 能看到可视化的接口文档，并能直接测试通接口。

---

## 🎨 Phase 3: 前端架构搭建 (Frontend Architecture)

**目标**: 搭建基于 Ant Design 的后台管理布局，封装网络请求层。

- [x] **3.1 清理与样板代码移除**
  - 删除 Vite 默认生成的 React Logo 和 CSS，重置 `App.tsx`。
- [x] **3.2 路由与布局配置 (Router & Layout)**
  - 安装 `react-router-dom`。
  - 设计 `MainLayout`：可以复用的侧边栏 (Sider) + 顶部导航 (Header) + 内容区 (Outlet)。
  - 配置基础路由：`/dashboard`, `/users`。
- [x] **3.3 网络层封装 (Axios)**
  - 安装 `axios`。
  - 封装 `request.ts`：
    - 统一 BaseURL。
    - **拦截器**：自动处理 Token（为未来做准备）、统一处理后端返回的 `code !== 200` 的错误提示。

---

## 🔗 Phase 4: 前后端联调 (Integration)

**目标**: 前端真实调用后端接口，实现数据闭环。

- [x] **4.1 用户列表页 (User List)**
  - 定义 TypeScript 接口类型 `IUser` (对应后端的 Entity)。
  - 使用 `ProTable` (或 Antd Table) 请求 `GET /users` 接口。
  - 渲染真实数据库数据。
- [x] **4.2 跨域处理 (CORS)**
  - 在 NestJS 后端开启 CORS，允许前端 `5173` 端口访问。
- [x] **4.3 新增/编辑功能**
  - 弹窗表单 (ModalForm) 调用 `POST /users` 和 `PATCH /users`。

---

## 🚀 Phase 5: 进阶功能 (Advanced - 待定)

- [ ] **5.1 登录认证 (Auth)**
  - 后端：JWT 签发与 Guard 守卫。
  - 前端：Login 页面 + 路由权限控制。
- [ ] **5.2 部署 (DevOps)**
  - 编写前端 `Dockerfile` (Nginx)。
  - 完善 `docker-compose.yml` 一键启动前后端。
