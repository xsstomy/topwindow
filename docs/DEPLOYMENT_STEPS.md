# Cloudflare Workers 部署详细步骤

## 前提条件

1. 已完成 OpenNext 构建配置
2. 拥有 Cloudflare 账户
3. 项目已构建成功（`.open-next/worker.js` 存在）

## 第一步：验证本地构建

```bash
# 1. 清理旧的构建文件
npm run clean

# 2. 重新构建项目
npm run build:worker

# 3. 验证构建成功 - 确保看到 "Worker saved in .open-next/worker.js 🚀"
# 4. 测试本地预览
npm run preview:worker
# 访问 http://localhost:8787 验证功能正常
```

## 第二步：Cloudflare 账户准备

### 2.1 登录 Wrangler CLI

```bash
# 登录 Cloudflare 账户
npx wrangler auth login
```

这会打开浏览器，需要：
1. 登录您的 Cloudflare 账户
2. 授权 Wrangler 访问权限
3. 回到终端确认登录成功

### 2.2 验证账户信息

```bash
# 查看当前登录的账户信息
npx wrangler whoami
```

## 第三步：配置敏感环境变量

### 方法1：在 Cloudflare 网站配置（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 [https://dash.cloudflare.com](https://dash.cloudflare.com)
   - 登录您的账户

2. **进入 Workers & Pages**
   - 点击左侧菜单的 "Workers & Pages"
   - 找到名为 "topwindow" 的 Worker（部署后才会出现）
   - 点击进入 Worker 详情页

3. **配置环境变量**
   - 点击 "Settings" 标签
   - 点击 "Variables" 部分
   - 点击 "Add variable" 按钮

4. **添加以下敏感变量**（选择 "Encrypt" 选项）：

   ```
   变量名: SUPABASE_SERVICE_ROLE_KEY
   值: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6ZmduZWpxdnhzYWJweGNrdm9zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTc0OTg5MSwiZXhwIjoyMDcxMzI1ODkxfQ.xj-so5e_NtFviitpexAPSJubaLuKAz9QSABzoxgRWRE
   ☑️ Encrypt

   变量名: NEXTAUTH_SECRET
   值: 976e26b57500b4ca297e5677dfb3b4b6f88c93b7d106577bf82cc02ec9e90288
   ☑️ Encrypt

   变量名: CREEM_SECRET_KEY_PROD
   值: creem_1UXe5wCQ2gIVWAEK0pNQXF
   ☑️ Encrypt

   变量名: CREEM_WEBHOOK_SECRET_PROD
   值: whsec_4W7x5Rrauo491E9uBASftB
   ☑️ Encrypt

   变量名: CREEM_PUBLIC_KEY_PROD
   值: prod_6pCR1fo402Umzod8ENwsoY
   ☐ Encrypt (公共密钥不需要加密)

   变量名: PADDLE_API_KEY_PROD
   值: sk_live_your_production_key_here
   ☑️ Encrypt

   变量名: RESEND_API_KEY
   值: your_resend_api_key
   ☑️ Encrypt

   变量名: DEVICE_FINGERPRINT_SALT
   值: 976e26b57500b4ca297e5677dfb3b4b6f88c93b7d106577bf82cc02ec9e90288_analytics
   ☑️ Encrypt
   ```

5. **保存配置**
   - 每添加一个变量都点击 "Save" 
   - 完成后点击 "Deploy" 重新部署以应用变更

### 方法2：使用 CLI 配置

```bash
# 如果您更喜欢命令行方式
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put NEXTAUTH_SECRET
npx wrangler secret put CREEM_SECRET_KEY_PROD
npx wrangler secret put CREEM_WEBHOOK_SECRET_PROD
npx wrangler secret put PADDLE_API_KEY_PROD
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put DEVICE_FINGERPRINT_SALT
```

### 3.2 验证密钥设置

```bash
# 列出所有已设置的密钥（不会显示具体值）
npx wrangler secret list
```

## 第四步：首次部署

### 4.1 部署到生产环境

```bash
# 方法1: 使用预配置的部署命令
npm run deploy

# 方法2: 直接使用 wrangler
npx wrangler deploy

# 方法3: 部署到特定环境
npx wrangler deploy --env production
```

### 4.2 验证部署成功

部署成功后，您会看到类似输出：
```
Total Upload: 2.5 MB / gzip: 500 KB
Uploaded topwindow (1.23 seconds)
Published topwindow (0.34 seconds)
  https://topwindow.<your-subdomain>.workers.dev
```

## 第五步：自定义域名配置（可选）

### 5.1 在 Cloudflare Dashboard 配置（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 [https://dash.cloudflare.com](https://dash.cloudflare.com)

2. **进入 Workers 管理页面**
   - 点击左侧菜单 "Workers & Pages"
   - 找到 "topwindow" Worker
   - 点击进入详情页

3. **配置自定义域名**
   - 点击 "Settings" 标签
   - 滚动到 "Triggers" 部分
   - 点击 "Add Custom Domain" 按钮
   - 输入域名：`topwindow.app`
   - 点击 "Add Custom Domain"

4. **配置域名解析**
   - 在同一个 Cloudflare 账户中选择您的域名
   - 进入 "DNS" 设置
   - 确保有以下 DNS 记录：
     ```
     类型: A
     名称: topwindow.app (或 @)
     内容: 192.0.2.1 (占位符IP，Cloudflare会自动处理)
     代理状态: 已代理（橙色云朵图标）
     ```

5. **SSL/TLS 设置**
   - 进入域名的 "SSL/TLS" 设置
   - 选择 "Full" 或 "Full (strict)" 模式
   - 等待 SSL 证书生效（通常几分钟）

### 5.2 使用 CLI 配置（可选）

```bash
# 添加自定义路由（如果您更喜欢命令行）
npx wrangler route add "topwindow.app/*" topwindow
```

### 5.3 验证域名配置

- 访问 `https://topwindow.app` 确认网站可以正常访问
- 检查 SSL 证书是否正确（浏览器地址栏显示锁头图标）

## 第六步：验证部署

### 6.1 功能测试

访问您的部署地址并测试：

1. **主页**: `https://topwindow.app/`
2. **认证**: `https://topwindow.app/auth/login`
3. **API测试**: `https://topwindow.app/api/products/init`
4. **支付流程**: `https://topwindow.app/test-payment`

### 6.2 检查日志

```bash
# 实时查看 Worker 日志
npx wrangler tail

# 查看特定环境的日志
npx wrangler tail --env production
```

## 第七步：监控和维护

### 7.1 查看指标

```bash
# 查看 Worker 分析数据
npx wrangler analytics
```

### 7.2 更新部署

当有代码更改时：
```bash
# 1. 重新构建
npm run build:worker

# 2. 部署更新
npm run deploy
```

## 常见问题解决

### 环境变量问题
```bash
# 查看当前环境变量
npx wrangler secret list

# 删除错误的密钥
npx wrangler secret delete SECRET_NAME

# 重新设置正确的密钥
npx wrangler secret put SECRET_NAME
```

### 域名解析问题
- 检查 DNS 设置是否正确指向 Cloudflare
- 确保 SSL/TLS 模式为 "Full" 或 "Full (strict)"

### 构建失败
```bash
# 检查构建日志
npm run build:worker 2>&1 | tee build.log

# 清理重建
npm run clean && npm run build:worker
```

## 成功指标

部署成功后您应该看到：
- ✅ Wrangler 显示部署成功信息
- ✅ 可以访问您的网站
- ✅ API 路由正常工作
- ✅ Supabase 数据库连接正常
- ✅ 支付流程可以测试

现在您的 Next.js 应用已成功部署到 Cloudflare Workers！