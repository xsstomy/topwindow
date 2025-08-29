import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// 基础配置示例（推荐用于大多数项目）
export default defineCloudflareConfig({
  // 大多数项目只需要空配置即可开始使用
});

// 高级配置示例（可选，适用于复杂项目）
/*
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  // R2 增量缓存（需要 R2 存储桶）
  incrementalCache: r2IncrementalCache,
  
  // 缓存拦截（实验性功能）
  enableCacheInterception: true,
});
*/