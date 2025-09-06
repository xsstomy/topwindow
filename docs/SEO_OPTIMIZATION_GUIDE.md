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
    "price": "4.99",
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
- **Target**: "Keep windows always on top on macOS"
- **Content**: Deep dive into always-on-top functionality
- **H1**: "Keep Any macOS Window Always on Top"

#### `/features/hotkeys/` 
- **Target**: "Custom hotkeys for window pinning"
- **Content**: Keyboard shortcut customization guide
- **H1**: "Custom Hotkey Support for Window Management"

#### `/features/screencapturekit/`
- **Target**: "ScreenCaptureKit-powered window pinning"  
- **Content**: Technical implementation details
- **H1**: "ScreenCaptureKit Integration for Precise Window Control"

#### `/features/lightweight/`
- **Target**: "Lightweight productivity utility for macOS"
- **Content**: Performance benefits and system resource usage
- **H1**: "Lightweight macOS Utility for Enhanced Performance"

### 2. FAQ Page (`/faq/`)

Target common search queries:

**Key Questions to Address:**
- "How to keep a window always on top in macOS?"
- "Does macOS have native always on top?"
- "Best window pinning tool for Mac"
- "TopWindow vs other Mac utilities"
- "How to pin Safari window on top"
- "macOS window management shortcuts"

### 3. Download & Installation Guide (`/download/`)

Separate from main download button, include:
- Step-by-step installation instructions
- System requirements (macOS 13.0+, Intel & Apple Silicon)
- Troubleshooting common installation issues
- Security settings for unsigned apps

---

## Phase 3: Long-term Content Strategy (Low Priority)

### 1. Blog/Guides Section (`/blog/`)

**Content Ideas:**
- "Top 5 Productivity Hacks for macOS Users"
- "Window Management Best Practices for Developers"
- "How ScreenCaptureKit Changed Mac App Development"
- "Multitasking Tips: Beyond Mission Control"

### 2. Pricing Page Optimization (`/pricing/`)

Clear comparison between Free and Pro versions:
- Feature matrix
- Use case scenarios
- ROI for productivity gains

---

## Technical Implementation Checklist

### Core Files to Modify

- [ ] `src/lib/metadata.ts` - Update meta tags and keywords
- [ ] `src/app/layout.tsx` - Replace structured data JSON-LD  
- [ ] `src/app/page.tsx` - Optimize H1 tags and content structure
- [ ] Create new feature pages under `src/app/features/`
- [ ] Create FAQ page at `src/app/faq/`
- [ ] Create dedicated download page at `src/app/download/`

### SEO Technical Requirements

- [ ] Ensure all new pages have unique titles and descriptions
- [ ] Add proper H1/H2/H3 heading hierarchy
- [ ] Include internal linking between related pages
- [ ] Add breadcrumb navigation for feature pages
- [ ] Optimize image alt texts
- [ ] Ensure fast loading times (< 3 seconds)

### Content Guidelines

1. **Keyword Density**: Natural integration, avoid keyword stuffing
2. **Content Length**: Minimum 300 words per page for better ranking
3. **User Intent**: Focus on solving user problems, not just keywords
4. **E-A-T**: Demonstrate expertise, authoritativeness, and trustworthiness

---

## Monitoring and Analytics

### Key Metrics to Track

1. **Organic Search Traffic**: Google Analytics
2. **Keyword Rankings**: Google Search Console
3. **Click-through Rates**: Search Console performance data
4. **Page Load Speed**: Core Web Vitals
5. **Mobile Usability**: Though desktop-focused, ensure responsive design

### Tools Setup

- [ ] Google Search Console verification
- [ ] Google Analytics 4 (already implemented)
- [ ] Schema markup validation (schema.org validator)
- [ ] Sitemap.xml submission to search engines

---

## Success Metrics

### 3-Month Goals
- 50% increase in organic search traffic
- Rank in top 10 for "mac window always on top"
- Improved click-through rate from search results

### 6-Month Goals  
- Rank in top 5 for primary keywords
- 100% increase in organic downloads
- Feature snippets for FAQ content

---

## Notes

- All content must be in **English only** (per project requirements)
- Focus on overseas/international users
- Maintain clean, professional tone throughout
- Regular content updates to maintain freshness signals

## Implementation Priority

1. **Week 1**: Phase 1 optimizations (high impact, low effort)
2. **Week 2-3**: Create feature pages (medium impact, medium effort)
3. **Month 2**: FAQ and download pages
4. **Month 3+**: Blog content and long-term strategy

This guide provides a structured approach to significantly improve TopWindow's search engine visibility while maintaining quality user experience.