# 部署指南

## 前置要求

1. 注册 [Cloudflare](https://dash.cloudflare.com/) 账户
2. 安装 Node.js 18+
3. 安装 Wrangler CLI: `npm install -g wrangler`

## 部署步骤

### 1. 登录 Cloudflare

```bash
wrangler login
```

### 2. 创建 D1 数据库

```bash
wrangler d1 create baijiu-chuhai-db
```

复制输出的 `database_id`，更新 `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "baijiu-chuhai-db"
database_id = "你的-database-id"
```

### 3. 初始化数据库

```bash
wrangler d1 execute baijiu-chuhai-db --file=./schema.sql
```

### 4. 创建管理员

```bash
# 默认密码: admin (SHA256)
wrangler d1 execute baijiu-chuhai-db --command="INSERT INTO admins (username, password_hash) VALUES ('admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918')"
```

### 5. 创建 R2 存储桶

```bash
wrangler r2 bucket create baijiu-chuhai-images
```

### 6. 构建并部署

```bash
npm install
npm run build
wrangler pages deploy dist
```

### 7. 配置自定义域名

在 Cloudflare Dashboard > Pages > 你的项目 > Custom domains 添加域名。

## 环境变量配置

在 Cloudflare Dashboard > Pages > Settings > Environment variables 添加:

```
JWT_SECRET=your-secret-key
ADMIN_PASSWORD_SALT=your-salt
```

## 生产环境优化

### 1. 密码加密

替换 `functions/api/admin/login.js` 中的简单哈希为 bcrypt:

```javascript
import bcrypt from 'bcryptjs'

// 验证密码
const isValid = await bcrypt.compare(password, admin.password_hash)
```

### 2. JWT 认证

```javascript
import jwt from '@tsndr/cloudflare-worker-jwt'

// 生成 token
const token = await jwt.sign({ userId: admin.id }, env.JWT_SECRET)

// 验证 token
const isValid = await jwt.verify(token, env.JWT_SECRET)
```

### 3. CORS 配置

在 Functions 中添加 CORS 头:

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yourdomain.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
```

## 监控与日志

在 Cloudflare Dashboard 查看:
- Analytics: 访问统计
- Logs: 实时日志
- D1 Metrics: 数据库性能

## 备份

定期导出 D1 数据:

```bash
wrangler d1 export baijiu-chuhai-db --output=backup.sql
```

## 故障排查

### 数据库连接失败
- 检查 `wrangler.toml` 中的 `database_id`
- 确认数据库已创建并初始化

### API 404 错误
- 确认 Functions 文件路径正确
- 检查 Cloudflare Pages 部署日志

### 图片上传失败
- 确认 R2 存储桶已创建
- 检查 `wrangler.toml` 中的 bucket 配置