# 生产环境部署指南 (Production Deployment Guide)

本文档提供完整的生产环境部署流程。

## 📋 部署前准备

### 1. 服务器要求

- **操作系统**: Ubuntu 20.04+ / CentOS 7+ / Debian 10+
- **内存**: 最低 2GB，推荐 4GB+
- **存储**: 最低 20GB，推荐 50GB+
- **软件依赖**:
  - Docker 20.10+
  - Docker Compose 2.0+

### 2. 安装 Docker 和 Docker Compose

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# 验证安装
docker --version
docker compose version
```

## 🚀 部署步骤

### 步骤 1: 上传代码到服务器

```bash
# 方式一：使用 Git
git clone <your-repository-url>
cd full-stack-demo

# 方式二：使用 scp/rsync 上传
scp -r ./full-stack-demo user@server:/path/to/deploy/
```

### 步骤 2: 配置生产环境变量

创建 `.env.production` 文件（或修改现有 `.env`）：

```bash
# .env.production
# MySQL Database - 生产环境配置
DB_HOST=mysql
DB_PORT=3306
DB_USER=prod_user                    # ⚠️ 修改为强密码用户
DB_PASSWORD=your_strong_password     # ⚠️ 修改为强密码
DB_NAME=fullstack_db

# Application
PORT=3000

# JWT Secret - 必须修改！
JWT_SECRET=your_very_strong_jwt_secret_key_here_min_32_chars

# MySQL Root Password - 必须修改！
MYSQL_ROOT_PASSWORD=your_strong_root_password
```

**⚠️ 安全提示**:
- 务必修改所有默认密码
- JWT_SECRET 至少 32 位随机字符
- 不要将 `.env.production` 提交到 Git

### 步骤 3: 修改 docker-compose.yml（可选）

如果需要自定义端口或配置，修改 `docker-compose.yml`：

```yaml
services:
  mysql:
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-root}  # 使用环境变量
      # ... 其他配置

  backend:
    environment:
      JWT_SECRET: ${JWT_SECRET}  # 添加 JWT_SECRET
      # ... 其他配置
```

### 步骤 4: 构建并启动服务

```bash
# 使用生产环境变量（如果有 .env.production）
export $(cat .env.production | xargs)

# 构建并启动所有服务
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 步骤 5: 验证部署

```bash
# 1. 检查容器状态
docker-compose ps
# 应该看到 3 个容器都在运行: mysql, backend, frontend

# 2. 检查后端健康
curl http://localhost:3000

# 3. 检查前端
curl http://localhost

# 4. 检查 Swagger 文档
curl http://localhost:3000/api

# 5. 查看后端日志
docker-compose logs backend --tail 50
```

## 🔒 安全加固

### 1. 配置防火墙

```bash
# Ubuntu UFW 示例
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS (如果配置了)
sudo ufw allow 22/tcp      # SSH
sudo ufw enable

# 不要开放 3306 (MySQL) 和 3000 (Backend API) 到公网
# 这些端口仅用于容器内部通信
```

### 2. 配置 Nginx 反向代理（推荐）

在服务器上安装 Nginx 作为反向代理：

```nginx
# /etc/nginx/sites-available/fullstack-app
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态资源
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/fullstack-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. 配置 HTTPS（推荐使用 Let's Encrypt）

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 4. 配置数据库备份

创建备份脚本 `backup.sh`：

```bash
#!/bin/bash
BACKUP_DIR="/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="fullstack_mysql"

mkdir -p $BACKUP_DIR

# 备份数据库
docker exec $CONTAINER_NAME mysqldump -u root -p$MYSQL_ROOT_PASSWORD fullstack_db > $BACKUP_DIR/backup_$DATE.sql

# 保留最近 7 天的备份
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/backup_$DATE.sql"
```

添加到 crontab：
```bash
# 每天凌晨 2 点备份
0 2 * * * /path/to/backup.sh >> /var/log/mysql-backup.log 2>&1
```

## 🔄 更新部署

当有代码更新时：

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建并启动
docker-compose up -d --build

# 3. 查看日志确认无错误
docker-compose logs -f backend
```

## 🛠 常用运维命令

```bash
# 查看所有容器状态
docker-compose ps

# 查看实时日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# 重启服务
docker-compose restart backend

# 停止所有服务
docker-compose down

# 停止并删除数据卷（⚠️ 会删除数据库数据）
docker-compose down -v

# 进入容器内部调试
docker exec -it fullstack_backend sh
docker exec -it fullstack_mysql mysql -u root -p

# 查看资源使用情况
docker stats
```

## 📊 监控和日志

### 日志管理

配置日志轮转，避免日志文件过大：

```yaml
# docker-compose.yml 中添加
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 性能监控（可选）

可以集成以下监控工具：
- **Prometheus + Grafana**: 性能监控
- **ELK Stack**: 日志聚合
- **Sentry**: 错误追踪

## ⚠️ 常见问题

### 1. 容器无法启动

```bash
# 查看详细日志
docker-compose logs backend

# 检查端口占用
sudo netstat -tlnp | grep :3000
```

### 2. 数据库连接失败

```bash
# 确保 MySQL 容器已完全启动
docker-compose logs mysql

# 检查网络连接
docker network ls
docker network inspect full-stack-demo_app_network
```

### 3. 前端无法访问后端 API

检查 `frontend` 构建时的 API 地址配置，确保指向正确的后端地址。

## 📝 检查清单

部署前检查：
- [ ] 已修改所有默认密码
- [ ] JWT_SECRET 已设置为强随机字符串
- [ ] 已配置防火墙规则
- [ ] 已配置 HTTPS（生产环境）
- [ ] 已设置数据库自动备份
- [ ] 已配置日志轮转
- [ ] 已测试所有核心功能

---

## 🆘 获取帮助

如有问题，请：
1. 查看容器日志: `docker-compose logs`
2. 检查网络连接: `docker network inspect full-stack-demo_app_network`
3. 查看 GitHub Issues 或提交新 Issue
