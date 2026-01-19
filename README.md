# 百酒出海 (Baijiu Chuhai)

中国白酒出海中东迪拜招商平台官网

## 技术栈

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Cloudflare Pages Functions (Serverless)
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2
- **CMS**: React-Quill + DOMPurify

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 创建 D1 数据库

```bash
npx wrangler d1 create baijiu-chuhai-db
```

复制返回的 `database_id`，更新 `wrangler.toml` 中的 `database_id`。

### 3. 初始化数据库

```bash
npx wrangler d1 execute baijiu-chuhai-db --file=./schema.sql
```

### 4. 创建管理员账户

```bash
npx wrangler d1 execute baijiu-chuhai-db --command="INSERT INTO admins (username, password_hash) VALUES ('admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918')"
```

默认账户: `admin` / `admin` (密码为 SHA256 哈希)

### 5. 创建 R2 存储桶

```bash
npx wrangler r2 bucket create baijiu-chuhai-images
```

### 6. 本地开发

```bash
npm run dev
```

访问 http://localhost:5173

### 7. 部署到 Cloudflare Pages

```bash
npm run deploy
```

## 项目结构

```
baijiu-chuhai/
├── functions/              # Cloudflare Pages Functions (API)
│   └── api/
│       ├── news.js        # 获取新闻列表
│       ├── news/[id].js   # 获取新闻详情
│       ├── leads.js       # 提交咨询
│       └── admin/         # 管理后台 API
├── src/
│   ├── components/        # React 组件
│   ├── pages/            # 页面组件
│   │   ├── Home.jsx      # 首页
│   │   ├── News.jsx      # 新闻列表
│   │   ├── NewsDetail.jsx # 新闻详情
│   │   ├── Contact.jsx   # 联系我们
│   │   └── admin/        # 管理后台
│   ├── App.jsx
│   └── main.jsx
├── schema.sql            # 数据库结构
├── wrangler.toml         # Cloudflare 配置
└── package.json

```

## 功能特性

### 前台功能
- ✅ 响应式首页 (Mobile-first)
- ✅ 新闻动态列表与详情
- ✅ 在线咨询表单
- ✅ 高端商务风格 (深红/金色)

### 后台功能
- ✅ 管理员登录
- ✅ 咨询列表管理
- ✅ 新闻发布 (富文本编辑器)
- ✅ 图片上传 (R2)

## 安全注意事项

⚠️ **生产环境部署前必须修改**:

1. 修改管理员密码 (使用 bcrypt)
2. 实现 JWT 认证
3. 添加 CORS 配置
4. 启用 HTTPS
5. 配置环境变量

## License

MIT