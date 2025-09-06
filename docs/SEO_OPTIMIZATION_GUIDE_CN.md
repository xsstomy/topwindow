# TopWindow SEO 优化指南

这份文档详细描述了 TopWindow.app（macOS 窗口管理工具）的全面 SEO 优化策略。

## 当前 SEO 状态

### ✅ 已实现功能
- 基础 metadata 配置（`src/lib/metadata.ts`）
- 结构化数据 JSON-LD（SoftwareApplication 类型）
- OpenGraph 和 Twitter Card meta 标签
- Google Analytics 集成
- Next.js SEO 友好框架

### 📈 优化机会
基于分析，我们需要增强现有的 SEO 元素并扩展内容架构以提高搜索可见性。

---

## 第一阶段：立即改进（高优先级）

### 1. 增强结构化数据 JSON-LD

**位置**: `src/app/layout.tsx`（第 44-49 行）

**现状**: 基础 SoftwareApplication 架构
**替换为**:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PinTop - Window Always on Top for macOS",
  "operatingSystem": "macOS",
  "applicationCategory": "UtilityApplication",
  "description": "PinTop helps you keep any window always on top on macOS. Lightweight, fast, and customizable with hotkey support and ScreenCaptureKit integration.",
  "url": "https://topwindow.app",
  "image": "https://topwindow.app/images/logo.png",
  "screenshot": [
    "https://topwindow.app/images/screenshot-1.png",
    "https://topwindow.app/images/screenshot-2.png"
  ],
  "video": "https://topwindow.app/multipin.mp4",
  "installUrl": "https://downloads.topwindow.app/releases/latest/TopWindow.dmg",
  "fileSize": "12MB",
  "author": {
    "@type": "Organization",
    "name": "PinTop Team"
  },
  "offers": {
    "@type": "Offer",
    "price": "9.99",
    "priceCurrency": "USD",
    "description": "Pro version with full features and updates",
    "availability": "https://schema.org/InStock",
    "url": "https://topwindow.app/pricing"
  },
  "downloadUrl": "https://topwindow.app/download",
  "softwareVersion": "1.0.0",
  "featureList": [
    "Keep windows always on top",
    "Hotkey support for quick toggle",
    "ScreenCaptureKit-based window pinning",
    "Lightweight and fast performance",
    "Minimal and modern UI for macOS"
  ]
}
```

### 2. 视频 SEO 增强

**为现有演示视频添加 VideoObject 架构**（`/multipin.mp4`）:

```json
{
  "@type": "VideoObject",
  "name": "TopWindow Multi-Pin Demo",
  "description": "See how TopWindow pins multiple windows on top simultaneously for enhanced macOS productivity",
  "thumbnailUrl": "https://topwindow.app/images/video-thumbnail.jpg",
  "contentUrl": "https://topwindow.app/multipin.mp4",
  "duration": "PT2M30S",
  "uploadDate": "2024-01-01"
}
```

### 3. Meta 标签优化

**位置**: `src/lib/metadata.ts`

**更新这些值**:

```typescript
export const siteConfig = {
  title: 'PinTop – Keep Windows Always on Top for macOS | Lightweight Productivity Tool',
  description: 'PinTop is a macOS utility that keeps any window always on top. Lightweight, fast, and customizable with hotkeys and ScreenCaptureKit support. Download now to boost productivity.',
  keywords: [
    // 增强关键词策略
    'mac window always on top',
    'macOS fix window on top', 
    'PinTop',
    'ScreenCaptureKit window pinning',
    'macOS window utility hotkey',
    'always on top keyboard shortcut',
    'topmost window mac productivity',
    'mac multitasking tool',
    'macOS window manager lightweight',
    'pin window on top mac',
    // ... 现有关键词
  ]
}
```

---

## 第二阶段：内容架构扩展（中优先级）

### 1. 功能特定着陆页

创建专门页面进行长尾关键词优化:

#### `/features/always-on-top/`
- **目标关键词**: "Keep windows always on top on macOS"
- **内容**: 深入介绍置顶功能
- **H1**: "Keep Any macOS Window Always on Top"

#### `/features/hotkeys/` 
- **目标关键词**: "Custom hotkeys for window pinning"
- **内容**: 键盘快捷键自定义指南
- **H1**: "Custom Hotkey Support for Window Management"

#### `/features/screencapturekit/`
- **目标关键词**: "ScreenCaptureKit-powered window pinning"  
- **内容**: 技术实现细节
- **H1**: "ScreenCaptureKit Integration for Precise Window Control"

#### `/features/lightweight/`
- **目标关键词**: "Lightweight productivity utility for macOS"
- **内容**: 性能优势和系统资源使用
- **H1**: "Lightweight macOS Utility for Enhanced Performance"

### 2. FAQ 页面 (`/faq/`)

针对常见搜索查询:

**需要回答的关键问题:**
- "How to keep a window always on top in macOS?"
- "Does macOS have native always on top?"
- "Best window pinning tool for Mac"
- "TopWindow vs other Mac utilities"
- "How to pin Safari window on top"
- "macOS window management shortcuts"

### 3. 下载安装指南 (`/download/`)

独立于主下载按钮，包含:
- 逐步安装说明
- 系统要求（macOS 13.0+，Intel 和 Apple Silicon）
- 常见安装问题故障排除
- 未签名应用的安全设置

---

## 第三阶段：长期内容策略（低优先级）

### 1. 博客/指南板块 (`/blog/`)

**内容想法:**
- "macOS 用户的 5 大生产力技巧"
- "开发者的窗口管理最佳实践"
- "ScreenCaptureKit 如何改变 Mac 应用开发"
- "多任务处理技巧：超越 Mission Control"

### 2. 定价页面优化 (`/pricing/`)

免费版和专业版的清晰对比:
- 功能矩阵
- 使用场景
- 生产力提升的投资回报率

---

## 技术实施清单

### 需要修改的核心文件

- [ ] `src/lib/metadata.ts` - 更新 meta 标签和关键词
- [ ] `src/app/layout.tsx` - 替换结构化数据 JSON-LD  
- [ ] `src/app/page.tsx` - 优化 H1 标签和内容结构
- [ ] 在 `src/app/features/` 下创建新功能页面
- [ ] 在 `src/app/faq/` 创建 FAQ 页面
- [ ] 在 `src/app/download/` 创建专用下载页面

### SEO 技术要求

- [ ] 确保所有新页面都有独特的标题和描述
- [ ] 添加正确的 H1/H2/H3 标题层次结构
- [ ] 在相关页面之间包含内部链接
- [ ] 为功能页面添加面包屑导航
- [ ] 优化图片 alt 文本
- [ ] 确保快速加载时间（< 3 秒）

### 内容指导原则

1. **关键词密度**: 自然整合，避免关键词堆砌
2. **内容长度**: 每页最少 300 词以获得更好排名
3. **用户意图**: 专注于解决用户问题，不仅仅是关键词
4. **E-A-T**: 展示专业性、权威性和可信度

---

## 监控和分析

### 需要跟踪的关键指标

1. **自然搜索流量**: Google Analytics
2. **关键词排名**: Google Search Console
3. **点击率**: Search Console 性能数据
4. **页面加载速度**: 核心网页指标
5. **移动可用性**: 虽然专注于桌面，但确保响应式设计

### 工具设置

- [ ] Google Search Console 验证
- [ ] Google Analytics 4（已实施）
- [ ] 架构标记验证（schema.org 验证器）
- [ ] 向搜索引擎提交 Sitemap.xml

---

## 成功指标

### 3 个月目标
- 自然搜索流量增长 50%
- "mac window always on top" 关键词排名进入前 10
- 搜索结果点击率提升

### 6 个月目标  
- 主要关键词排名进入前 5
- 自然下载量增长 100%
- FAQ 内容获得特色片段

---

## 注意事项

- 所有内容必须**仅使用英语**（按项目要求）
- 专注于海外/国际用户
- 保持清洁、专业的语调
- 定期内容更新以维持新鲜度信号

## 实施优先级

1. **第 1 周**: 第一阶段优化（高影响，低工作量）
2. **第 2-3 周**: 创建功能页面（中影响，中工作量）
3. **第 2 个月**: FAQ 和下载页面
4. **第 3 个月+**: 博客内容和长期策略

这份指南提供了一个结构化的方法来显著改善 TopWindow 的搜索引擎可见性，同时保持高质量的用户体验。