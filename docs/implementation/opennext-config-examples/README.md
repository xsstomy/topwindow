# OpenNext + Cloudflare Workers 配置示例

本目录包含 OpenNext + Cloudflare Workers 部署所需的所有配置文件示例。

## 文件结构

```
opennext-config-examples/
├── README.md                     # 本文件
├── open-next.config.ts          # OpenNext 配置文件（TypeScript）
├── next.config.js               # Next.js 配置文件
├── wrangler.toml                # Cloudflare Workers 配置
├── worker.js                    # Workers 入口文件
├── package.json.example         # 包依赖和脚本示例
└── cloudflare-image-loader.js   # 图片加载器
```

## 使用说明

### 1. 复制配置文件

```bash
# 复制到项目根目录
cp docs/implementation/opennext-config-examples/open-next.config.ts ./
cp docs/implementation/opennext-config-examples/next.config.js ./
cp docs/implementation/opennext-config-examples/wrangler.jsonc ./

# 复制到 lib 目录
mkdir -p lib
cp docs/implementation/opennext-config-examples/cloudflare-image-loader.js ./lib/
```

### 2. 更新 package.json

参考 `package.json.example` 文件，添加必要的依赖和脚本：

```bash
# 安装核心依赖（注意正确的包名）
npm install @opennextjs/cloudflare@latest --save-dev
npm install @cloudflare/workers-types --save-dev

# 安装全局工具（要求版本 3.99.0 或更高）
npm install -g wrangler@latest
```

### 3. 配置环境变量

```bash
# 使用 Wrangler 设置敏感环境变量
wrangler secret put NEXT_PUBLIC_SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put NEXTAUTH_SECRET
```

### 4. 创建 KV 命名空间

```bash
# 创建缓存命名空间
wrangler kv:namespace create "CACHE"
wrangler kv:namespace create "CACHE" --preview

# 创建会话命名空间
wrangler kv:namespace create "SESSIONS"  
wrangler kv:namespace create "SESSIONS" --preview
```

### 5. 更新配置文件

根据 KV 命名空间创建结果，更新 `wrangler.toml` 中的 ID：

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "你的-kv-namespace-id"
preview_id = "你的-preview-kv-namespace-id"
```

## 配置文件详解

### open-next.config.ts
- 配置 OpenNext 转换选项（TypeScript 版本）
- 使用 defineCloudflareConfig 函数
- 定义缓存、安全和性能配置

### next.config.js
- 启用边缘运行时支持
- 配置 TypeScript 错误跳过（解决原问题）
- 优化 Webpack 打包配置

### wrangler.jsonc  
- 定义 Workers 项目配置（JSONC 格式更好的 IDE 支持）
- 设置环境变量和绑定
- 配置资源限制和兼容性设置

### worker.js
- Workers 入口文件
- 请求处理和路由
- 错误处理和日志记录

### cloudflare-image-loader.js
- 自定义图片优化加载器
- 支持 Cloudflare Images 服务
- 提供响应式图片处理

## 自定义配置

### 1. 修改项目名称

在 `wrangler.toml` 中更新：
```toml
name = "你的项目名称"
```

### 2. 配置自定义域名

```toml
[[route]]
pattern = "yourdomain.com/*"
zone_name = "yourdomain.com"
```

### 3. 启用额外绑定

```toml
# R2 存储
[[r2_buckets]]
binding = "ASSETS"
bucket_name = "your-bucket-name"

# D1 数据库
[[d1_databases]]
binding = "DB"
database_name = "your-db-name"
database_id = "your-database-id"
```

## 构建和部署

### 开发环境

```bash
# 本地开发
npm run dev:workers

# 或直接使用 wrangler
wrangler dev
```

### 生产部署

```bash
# 构建和部署
npm run build:workers
npm run deploy:workers

# 或使用脚本
./scripts/deploy-workers.sh
```

## 验证部署

### 1. 健康检查

访问：`https://your-worker.workers.dev/health`

预期响应：
```json
{
  "status": "healthy",
  "timestamp": "2025-08-29T...",
  "version": "1.0.0"
}
```

### 2. 功能测试

- [ ] 首页加载正常
- [ ] API 接口响应正确
- [ ] 数据库连接成功
- [ ] 认证功能工作
- [ ] 支付流程正常

### 3. 性能测试

```bash
# 使用 Lighthouse 测试
lighthouse https://your-worker.workers.dev --output json

# 使用 curl 测试响应时间
curl -w "@curl-format.txt" -o /dev/null -s https://your-worker.workers.dev
```

## 故障排查

如果遇到问题，请参考：
- [问题排查指南](../troubleshooting/OPENNEXT_TROUBLESHOOTING.md)
- [主要方案文档](../OPENNEXT_CLOUDFLARE_WORKERS_PLAN.md)

## 相关链接

- [OpenNext 文档](https://opennext.js.org/cloudflare)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

---

*配置文件最后更新：2025-08-29*