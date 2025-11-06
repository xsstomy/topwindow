# 项目上下文

## 项目目的
TopWindow 是一个 macOS SaaS 应用程序和营销网站，用于窗口管理工具。该项目已从静态着陆页发展为功能完整的 SaaS 平台，包含用户身份验证、许可授权和支付处理功能。该网站服务海外用户，必须完全使用英文。

关键业务目标：
- 为 TopWindow macOS 应用程序提供专业的营销平台
- 实现 SaaS 功能，包括用户身份验证和许可证管理
- 支持支付处理和订阅管理
- 提供无缝的下载和许可证激活体验
- 提供全面的用户仪表板，用于管理许可证和设备

## 技术栈

### 前端技术栈
- **框架**: Next.js 14 with App Router
- **语言**: TypeScript 严格类型安全（不允许使用 `as any`）
- **样式**: Tailwind CSS 与自定义设计系统
- **动画**: Framer Motion 提供流畅的 UI 交互
- **图标**: Lucide React 提供一致的图标系统
- **状态管理**: React Context (AuthContext) + useState/useEffect
- **HTTP 客户端**: Supabase auth-helpers 用于服务器/客户端组件

### 后端和数据库
- **数据库**: Supabase (PostgreSQL) 启用行级安全 (RLS)
- **身份验证**: Supabase Auth (邮箱 + Google OAuth)
- **实时功能**: Supabase 实时订阅
- **API 路由**: Next.js API 路由与适当的 TypeScript 类型

### 部署和基础设施
- **主要部署**: Cloudflare Workers (通过 OpenNext.js)
- **静态导出**: 独立输出用于边缘部署
- **存储**: Cloudflare R2 用于 DMG 文件发布
- **分析**: Google Analytics 4 全面跟踪
- **邮件**: Resend 用于事务邮件

### 开发工具
- **包管理器**: npm
- **类型检查**: TypeScript 严格模式配合 `tsc --noEmit`
- **代码格式化**: Prettier 单引号和尾随逗号
- **代码检查**: ESLint 使用 Next.js 推荐规则

## 项目约定

### 代码风格
- **语言**: 仅使用英语 - 代码、注释或文档中任何地方都不得有中文内容
- **类型安全**: 严格的 TypeScript，为所有数据结构定义明确的接口
- **数据库操作**: 必须使用 `@/types/database-insert-update.ts` 中的类型接口
- **禁止 `as any`**: 严格禁止类型断言
- **组件结构**: 所有 props 和返回类型都有适当的 TypeScript 类型
- **错误处理**: 一致的错误边界模式和用户友好的消息

### 架构模式

#### 服务器/客户端组件分离
- 服务器组件用于数据获取和数据库操作
- 客户端组件用于用户交互和状态管理
- 正确使用 `'use client'` 指令
- Supabase auth-helpers 用于服务器/客户端组件身份验证

#### 类型安全的数据库操作
- 所有数据库操作都有全面的 TypeScript 接口
- Supabase 查询和变更的严格类型
- 所有表都启用了行级安全 (RLS)
- 适当的身份验证上下文集成

#### 身份验证流程
- React Context 用于身份验证状态管理
- Google Analytics 集成用于用户跟踪
- 自动用户配置文件创建和管理
- 支持邮箱/密码和 Google OAuth

### 测试策略
- **当前状态**: 测试覆盖率有限 - 这是需要改进的领域
- **类型安全**: 重度依赖 TypeScript 严格模式进行编译时错误预防
- **手动测试**: `/docs/guides/` 中记录的全面手动测试工作流
- **API 测试**: 可用的测试端点 (`/test-payment`, `/test-license`, `/test-email`)

### Git 工作流
- **主分支**: `main` (生产部署)
- **当前分支**: `seo-top-window` (功能分支)
- **提交风格**: 约定式提交，清晰描述性消息
- **代码审查**: 所有更改都应保持仅英语内容和类型安全

## 领域上下文

### 产品领域
- **目标市场**: 寻求窗口管理解决方案的全球 macOS 用户
- **商业模式**: 按设备许可的 SaaS
- **用户旅程**: 匿名访客 → 试用用户 → 注册用户 → 付费客户
- **许可模式**: 基于设备的激活，有限制（通常每个许可证 3 个设备）

### 数据库架构
Supabase 中的关键表：
- **user_profiles**: 扩展的用户信息和偏好设置
- **products**: 软件许可产品和定价
- **payments**: 支付处理记录和交易历史
- **licenses**: 许可证密钥、激活状态和设备管理
- **user_devices**: 许可强制执行的设备管理
- **trial_analytics**: 试用使用跟踪和转化指标

### 业务逻辑
- **许可证生成**: 基于 UUID 的密钥，具有设备激活限制
- **支付处理**: Creem 支付系统集成（主要）和 Paddle（备用）
- **设备管理**: 基于硬件的设备 ID，具有回退机制
- **分析集成**: 全面的 GA4 用户行为跟踪

## 重要约束

### 语言和本地化
- **关键**: 所有内容必须使用英语 - 任何地方都不得有中文文本
- **国际受众**: 为全球/海外用户设计和编写
- **文化敏感性**: 在设计和文案中考虑文化差异

### 技术约束
- **类型安全**: 不使用 `as any` 类型断言 - 维护严格的 TypeScript 合规性
- **数据库安全**: 所有数据库操作必须使用 RLS 策略
- **边缘部署**: 必须与 Cloudflare Workers 静态导出兼容
- **性能**: 为全球 CDN 分发优化

### 业务约束
- **许可证安全**: 防止许可证共享并强制执行设备限制
- **支付合规**: 适当的 webhook 处理和支付处理
- **数据隐私**: GDPR 合规的用户数据处理
- **苹果生态系统**: 必须在苹果应用分发指南内工作

## 外部依赖

### 核心服务
- **Supabase**: 数据库、身份验证和实时服务
- **Creem 支付系统**: 主要支付处理器
- **Paddle**: 备用支付处理器
- **Cloudflare**: CDN、Workers 部署和 R2 存储
- **Google Analytics 4**: 用户行为跟踪和转化分析
- **Resend**: 事务邮件传递

### API 和集成
- **Google OAuth**: 社交身份验证提供商
- **Cloudflare R2**: DMG 文件存储和分发
- **GA4 Measurement Protocol**: 自定义事件跟踪
- **OpenNext.js**: Next.js 到 Cloudflare Workers 适配器

### 开发依赖
- **Node.js**: 运行时环境
- **npm**: 包管理
- **TypeScript**: 类型检查和编译
- **ESLint**: 代码质量和风格强制执行
- **Prettier**: 代码格式化

### 环境配置
- **支付模式**: 支持测试和生产环境
- **功能标志**: 基于环境的功能切换
- **Webhook 端点**: 可配置的支付 webhook URL
- **R2 同步**: 自动化 DMG 发布管理工作流