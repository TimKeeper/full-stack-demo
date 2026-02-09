# Full Stack Management System (全栈后台管理系统)

这是一个基于 **React** + **NestJS** 的现代全栈前后端分离管理系统。项目采用 Monorepo 架构，使用 pnpm 进行包管理，Docker 进行数据库编排。

## 📚 目录 (Table of Contents)

- [技术栈 (Tech Stack)](#-技术栈-tech-stack)
- [环境准备 (Prerequisites)](#-环境准备-prerequisites)
- [快速启动 (Quick Start)](#-快速启动-quick-start)
- [项目结构 (Project Structure)](#-项目结构-project-structure)
- [开发规范 (Development Guidelines)](#-开发规范-development-guidelines)
- [API 文档 (API Documentation)](#-api-文档-api-documentation)

## 🛠️ 技术栈 (Tech Stack)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **UI Library**: Ant Design 5
- **Language**: TypeScript
- **HTTP Client**: Axios

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: MySQL 5.7/8.0
- **ORM**: TypeORM
- **API Docs**: Swagger

### Infrastructure & Tools
- **Package Manager**: pnpm (Monorepo support)
- **Containerization**: Docker & Docker Compose
- **Linting**: ESLint, Prettier, Stylelint, Husky

## 📋 环境准备 (Prerequisites)

在开始之前，请确保您的开发环境已安装以下工具：

1. **Node.js**: >= 18.0.0
2. **pnpm**: >= 8.0.0 (`npm install -g pnpm`)
3. **Docker**: Desktop 或 Engine (用于运行 MySQL)

## 🚀 快速启动 (Quick Start)

按照以下步骤快速启动开发环境。

### 1. 安装依赖 (Install Dependencies)

在项目根目录下运行：

```bash
pnpm install
```

### 2. 配置环境变量 (Configure Environment)

项目根目录下已包含 `.env` 文件，用于定义数据库连接和端口信息。通常情况下，开发环境可直接使用默认值。

```ini
# .env 示例
DB_HOST=localhost
DB_PORT=3306
DB_USER=user
DB_PASSWORD=password
DB_NAME=fullstack_db
PORT=3000
```

### 3. 启动数据库 (Start Database)

使用 Docker Compose 启动 MySQL 服务：

```bash
docker-compose up -d
```

> **注意**: 如果是首次启动，MySQL 容器初始化可能需要几秒钟。TypeORM 已配置为 `synchronize: true`，会自动同步数据库表结构。

### 4. 启动后端服务 (Start Backend)

```bash
pnpm -F backend start:dev
```

- 服务地址: `http://localhost:3000`
- Swagger 文档: `http://localhost:3000/api`

### 5. 启动前端应用 (Start Frontend)

打开一个新的终端窗口：

```bash
pnpm -F frontend dev
```

- 访问地址: `http://localhost:5173`

## 📂 项目结构 (Project Structure)

```text
.
├── backend/                # NestJS 后端应用
│   ├── src/
│   │   ├── auth/           # 认证模块
│   │   ├── user/           # 用户模块
│   │   └── main.ts         # 入口文件
│   └── test/               # 测试文件
├── frontend/               # React 前端应用
│   ├── src/
│   │   ├── components/     # 公共组件
│   │   ├── pages/          # 页面组件
│   │   └── utils/          # 工具函数 (如 request.ts)
├── deploy/                 # 部署相关 (如 MySQL 数据挂载点)
├── package.json            # 根目录配置
├── docker-compose.yml      # Docker 编排文件
└── IMPLEMENTATION_PLAN.md   # 开发实施计划与进度记录
```

## 📝 开发规范 (Development Guidelines)

本项目集成了严格的代码规范工具。在提交代码前，Git Hooks (Husky) 会自动运行检查。

- **Lint**: `pnpm lint` (检查代码风格)
- **Format**: `pnpm format` (格式化代码)
- **Type Check**: `pnpm type-check` (TypeScript 类型检查)

### 提交规范 (Commit Convention)

遵循 Conventional Commits 规范，例如：
- `feat: add user login`
- `fix: fix cors issue`
- `docs: update readme`

## 🔌 API 文档 (API Documentation)

后端服务启动后，访问 **Swagger UI** 查看完整的 API 接口文档：

👉 **[http://localhost:3000/api](http://localhost:3000/api)**

你可以在 Swagger 页面直接测试接口调用。
