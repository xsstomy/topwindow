# Cloudflare API Token 设置指南

当无法使用浏览器登录时，可以使用 API Token 进行部署。

## 创建 API Token

1. **登录 Cloudflare Dashboard**
   - 访问 [https://dash.cloudflare.com](https://dash.cloudflare.com)

2. **创建 API Token**
   - 点击右上角头像 → "My Profile"
   - 选择 "API Tokens" 标签
   - 点击 "Create Token"

3. **配置权限**
   选择 "Custom Token"，配置以下权限：
   
   **Permissions:**
   - `Account` - `Cloudflare Workers:Edit`
   - `Zone` - `Zone:Read`
   - `Zone` - `DNS:Edit` （如果需要配置自定义域名）

   **Account Resources:**
   - `Include` - `All accounts`

   **Zone Resources:**
   - `Include` - `All zones from an account` 
   - 或选择特定的域名 `topwindow.app`

4. **生成 Token**
   - 点击 "Continue to summary"
   - 点击 "Create Token"
   - **重要**: 复制生成的 Token，它只会显示一次！

## 使用 API Token

### 方法1：环境变量

```bash
# 设置环境变量
export CLOUDFLARE_API_TOKEN=your_token_here

# 然后运行部署
npm run deploy
```

### 方法2：.env.local 文件

在项目根目录的 `.env.local` 文件中添加：

```bash
CLOUDFLARE_API_TOKEN=your_token_here
```

### 方法3：直接在命令中使用

```bash
CLOUDFLARE_API_TOKEN=your_token_here npm run deploy
```

## 部署命令示例

```bash
# 完整的部署命令
CLOUDFLARE_API_TOKEN=your_actual_token_here npm run deploy
```

## 验证 Token

测试 Token 是否有效：

```bash
CLOUDFLARE_API_TOKEN=your_token_here npx wrangler whoami
```

成功的话会显示您的账户信息。

## 安全注意事项

- ⚠️ **永远不要将 API Token 提交到代码仓库**
- ⚠️ **使用最小权限原则**
- ⚠️ **定期轮换 Token**
- ⚠️ **在 CI/CD 中使用 Secrets 管理**