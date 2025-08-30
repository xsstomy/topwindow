# Cloudflare R2 应用安装包托管方案

## 概述
本文档详细规划了使用 Cloudflare R2 存储服务托管 TopWindow 应用安装包的完整实施方案。该解决方案为海外用户提供免费、快速、可靠的下载服务。

## 费用分析与免费额度确认 ✅

### Cloudflare R2 免费额度 (2025年)
- **存储空间**: 10 GB/月（我们的10MB安装包完全适用）
- **下载请求**: 1000万次 Class B 操作/月
- **上传/管理请求**: 100万次 Class A 操作/月  
- **无时间限制**: 永久免费额度（不像 AWS S3 只有12个月限制）
- **无出口流量费**: 全球数据传输完全免费

### 我们的用例成本计算
- **安装包大小**: ~10MB
- **月下载量**: 即使1000次下载 = 10GB总流量
- **请求数量**: 1000次下载 = 1000次 Class B 操作（远低于1000万限制）
- **月度总成本**: ¥0.00 ✅

## 技术优势

### 性能优势
- 全球CDN加速，下载速度更快
- 自动压缩和优化
- 支持断点续传（HTTP range 请求）
- 99.9% 在线时间保证

### 集成优势
- 与现有 Cloudflare Workers 完美集成
- 统一管理控制台
- 一致的 SSL/TLS 证书管理
- 统一域名管理

### 开发体验
- Wrangler CLI 集成
- API 优先的自动化设计
- 版本控制支持
- 易于 CI/CD 集成

## 实施计划

### 阶段一：R2 存储桶设置
**预计时间**: 30分钟

1. **创建 R2 存储桶**
   ```bash
   # 使用 Wrangler CLI
   wrangler r2 bucket create topwindow-releases
   ```

2. **配置存储桶权限**
   - 设置下载文件的公共读取访问
   - 限制写入访问权限仅给授权用户
   - 配置网页下载的 CORS 设置

3. **生成 API 凭证**
   - 创建具有有限范围的 R2 API 令牌
   - 将凭证存储在环境变量中
   - 测试连接性和权限

### 阶段二：自定义域名配置
**预计时间**: 45分钟

1. **设置自定义域名**
   - 配置子域名: `downloads.topwindow.app`
   - 通过 CNAME/自定义主机名指向 R2 存储桶
   - 启用 SSL/TLS（Cloudflare 自动提供）

2. **域名验证**
   - 测试 SSL 证书功能
   - 验证下载 URL 可访问性
   - 检查全球传播状态

3. **URL 结构设计**
   ```
   https://downloads.topwindow.app/releases/
   ├── latest/
   │   ├── topwindow-setup.exe        # Windows 安装程序
   │   ├── topwindow-setup.dmg        # macOS 安装程序
   │   └── version.json               # 版本元数据
   ├── v1.0.0/
   │   ├── topwindow-setup.exe
   │   └── topwindow-setup.dmg
   └── v1.0.1/
       ├── topwindow-setup.exe
       └── topwindow-setup.dmg
   ```

### 阶段三：网站集成
**预计时间**: 90分钟

1. **下载页面组件**
   - 文件: `src/app/download/page.tsx`
   - 功能: 操作系统检测、版本选择、下载跟踪
   - 移动用户的响应式设计

2. **下载按钮组件**
   - 文件: `src/components/DownloadButton.tsx`
   - 功能: 下载进度、错误处理、分析统计
   - 支持多种文件格式

3. **下载服务层**
   - 文件: `src/lib/download-service.ts`
   - 功能: 版本管理、下载分析、链接生成
   - 下载统计的 API 集成

4. **版本管理 API**
   - 文件: `src/app/api/download/versions/route.ts`
   - 功能: 列出可用版本、获取最新版本
   - 发布版本的元数据管理

### 阶段四：自动化与 CI/CD
**预计时间**: 60分钟

1. **Wrangler 配置**
   - 文件: `wrangler.toml` 更新
   - R2 存储桶绑定配置
   - 环境变量设置

2. **上传脚本**
   - 文件: `scripts/upload-release.js`
   - 自动化文件上传到 R2
   - 版本标记和元数据生成

3. **GitHub Actions 集成**
   - 文件: `.github/workflows/release.yml`
   - 自动化发布部署
   - 版本号管理

## 需要变更的文件

### 新建文件
1. `src/app/download/page.tsx` - 下载页面 UI
2. `src/components/DownloadButton.tsx` - 下载按钮组件  
3. `src/lib/download-service.ts` - 下载服务逻辑
4. `src/app/api/download/versions/route.ts` - 版本管理 API
5. `scripts/upload-release.js` - 发布上传自动化
6. `.github/workflows/release.yml` - CI/CD 工作流

### 修改文件
1. `wrangler.toml` - 添加 R2 存储桶绑定
2. `src/app/layout.tsx` - 将下载页面添加到导航
3. `package.json` - 添加上传脚本和依赖项

## 安全考虑

### 访问控制
- 下载文件的只读公共访问
- 上传的身份验证写入访问
- 具有最小必需权限的 API 令牌

### 内容完整性
- 所有文件的 SHA-256 校验和
- 安装程序的数字签名
- 版本元数据验证

### 速率限制
- Cloudflare 内置的 DDoS 保护
- 每个 IP 的请求速率限制
- 下载滥用防护

## 监控与分析

### 下载指标
- 按版本和地区的下载次数
- 成功/失败率
- 热门下载时间和模式
- 用户代理和操作系统统计

### 性能监控
- 下载速度指标
- CDN 缓存命中率
- 错误率监控
- 正常运行时间跟踪

### 成本监控
- 针对免费额度限制的月度使用情况
- 请求计数跟踪
- 存储使用趋势
- 接近限制的警报设置

## 回滚策略

### 即时回滚选项
1. **DNS 回滚**: 将域名切换回之前的托管服务
2. **文件回滚**: 恢复之前版本的文件
3. **配置回滚**: 还原 wrangler.toml 更改

### 备份策略
- 所有发布文件的自动备份
- 版本历史维护
- Git 中的配置备份
- 下载统计的数据库备份

## 成功指标

### 技术 KPI
- 下载成功率 > 99%
- 全球平均下载速度 > 5 MB/s
- 页面加载时间 < 2秒
- 月度托管成本为零

### 业务 KPI
- 提高下载转化率
- 改善国际用户体验
- 减少下载相关的支持工单
- 更快的发布部署流程

## 时间安排总结

- **阶段一**: R2 设置（30分钟）
- **阶段二**: 域名配置（45分钟）  
- **阶段三**: 网站集成（90分钟）
- **阶段四**: 自动化（60分钟）
- **总预计时间**: 3.5小时

## 后续步骤

1. 确认方案批准
2. 开始阶段一实施
3. 每个阶段完成后进行测试
4. 记录任何问题或所需修改
5. 部署到生产环境并启用监控

---

*此方案确保为 TopWindow 的国际用户提供企业级性能和可靠性的同时，实现应用下载的完全免费托管。*