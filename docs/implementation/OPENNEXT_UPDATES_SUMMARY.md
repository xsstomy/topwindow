# OpenNext Cloudflare 配置更新总结

## 📋 基于官方仓库的关键更新

经过查看官方 `opennextjs-cloudflare` 仓库，我们对配置进行了重要更新以确保与最新版本完全兼容。

---

## 🔧 主要配置变更

### 1. **包名修正**
```diff
- "@opennext/cloudflare": "latest"
+ "@opennextjs/cloudflare": "latest"
```

### 2. **配置文件格式**
```diff
- opennext.config.js (JavaScript)
+ open-next.config.ts (TypeScript + defineCloudflareConfig)
```

### 3. **Wrangler 配置格式**
```diff
- wrangler.toml (TOML 格式)
+ wrangler.jsonc (JSONC 格式，更好的 IDE 支持)
```

### 4. **兼容性设置更新**
```diff
- compatibility_date: "2024-09-23"
+ compatibility_date: "2024-12-30"

- compatibility_flags: ["nodejs_compat"]  
+ compatibility_flags: ["nodejs_compat", "global_fetch_strictly_public"]
```

### 5. **构建脚本标准化**
```diff
- "build:workers": "next build && npx @opennextjs/cloudflare"
+ "build:worker": "npx @opennextjs/cloudflare build"
+ "preview:worker": "npx @opennextjs/cloudflare preview"
+ "preview": "npm run build:worker && npm run preview:worker"
```

---

## 📁 更新的文件列表

### 主要文档
- ✅ `OPENNEXT_CLOUDFLARE_WORKERS_PLAN.md` - 主方案文档
- ✅ `troubleshooting/OPENNEXT_TROUBLESHOOTING.md` - 问题排查指南

### 配置示例文件
- ✅ `open-next.config.ts` - 简化为基础配置 + 高级示例注释
- ✅ `next.config.js` - 添加 `initOpenNextCloudflareForDev()` 调用
- ✅ `wrangler.jsonc` - 新格式，更新兼容性设置
- ✅ `package.json.example` - 标准化脚本命令
- ✅ `README.md` - 同步所有配置变更

---

## 🎯 配置简化亮点

### 基础配置极简化
```typescript
// open-next.config.ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// 大多数项目只需要这个空配置
export default defineCloudflareConfig({});
```

### 高级功能按需启用
```typescript
// 仅在需要时启用高级功能
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache, // R2 缓存
  enableCacheInterception: true,        // 缓存拦截
});
```

### JSONC 配置格式优势
```jsonc
{
	"$schema": "node_modules/wrangler/config-schema.json", // 智能提示
	"name": "topwindow",
	"main": ".open-next/worker.js",
	"compatibility_date": "2024-12-30", // 最新兼容日期
	"compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"]
}
```

---

## 🚀 新的开发工作流

### 1. 创建项目（推荐）
```bash
npm create cloudflare@latest -- my-next-app --framework=next --platform=workers
```

### 2. 现有项目迁移
```bash
npm install @opennextjs/cloudflare@latest
npm install -g wrangler@latest  # 要求 >= 3.99.0
```

### 3. 构建和预览
```bash
npm run build:worker   # 构建 Workers 版本
npm run preview        # 本地预览
npm run deploy         # 部署到 Cloudflare
```

---

## ⚠️ 重要注意事项

### 版本要求
- **Wrangler**: >= 3.99.0
- **Node.js**: >= 18.0.0
- **Compatibility Date**: >= 2024-09-23（推荐 2024-12-30）

### 兼容性标志
- `nodejs_compat` - Node.js API 支持
- `global_fetch_strictly_public` - Fetch API 增强

### Runtime 选择
- ✅ **推荐**: Node.js Runtime（默认，功能更完整）
- ❌ **不推荐**: Edge Runtime（功能受限）

---

## 🔍 与之前版本的对比

| 项目 | 之前版本 | 更新版本 | 改进说明 |
|------|----------|----------|----------|
| 包名 | `@opennext/cloudflare` | `@opennextjs/cloudflare` | 官方正确包名 |
| 配置文件 | `opennext.config.js` | `open-next.config.ts` | TypeScript + 函数式配置 |
| Wrangler | `wrangler.toml` | `wrangler.jsonc` | 更好的 IDE 支持 |
| 兼容性日期 | `2024-09-23` | `2024-12-30` | 最新兼容性 |
| 构建命令 | `npx @opennext/cloudflare` | `npx @opennextjs/cloudflare build` | 标准化命令 |
| Runtime | Edge（错误） | Node.js（推荐） | 功能更完整 |

---

## 📖 参考资源

- [OpenNext Cloudflare 官方文档](https://opennext.js.org/cloudflare)
- [GitHub 官方仓库](https://github.com/opennextjs/opennextjs-cloudflare)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

---

## ✅ 验证清单

在使用新配置前，请确认：

- [ ] 包名使用 `@opennextjs/cloudflare`
- [ ] Wrangler 版本 >= 3.99.0
- [ ] 使用 `open-next.config.ts` 文件
- [ ] 使用 `wrangler.jsonc` 格式
- [ ] 兼容性日期设置为 `2024-12-30`
- [ ] 包含两个兼容性标志
- [ ] Next.js 配置中调用 `initOpenNextCloudflareForDev()`
- [ ] 使用标准化的构建脚本

---

*文档更新日期：2025-08-29*
*基于官方仓库版本：最新 main 分支*