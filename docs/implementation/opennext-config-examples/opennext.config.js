/** @type {import('@opennext/cloudflare').OpenNextConfig} */
module.exports = {
  // 指定 Cloudflare Workers 为目标平台
  target: 'cloudflare-workers',
  
  // 构建输出目录
  buildOutputPath: '.open-next',
  
  // Cloudflare Workers 特定配置
  cloudflare: {
    // 运行时类型
    runtime: 'workers',
    
    // 静态资源处理策略
    assets: {
      // 将小型资源内联到 worker 脚本中
      inline: true,
      // 内联文件大小限制 (4KB)
      inlineLimit: 4096,
      // 大型资源使用 R2 存储 (可选)
      // r2Bucket: 'topwindow-assets'
    },
    
    // 路由映射配置
    routes: {
      '/api/*': 'api',           // API 路由
      '/_next/static/*': 'static', // 静态资源
      '*': 'app'                 // 应用路由
    },
    
    // 环境变量处理
    environment: {
      ENVIRONMENT: 'production',
      NODE_ENV: 'production'
    },
    
    // 兼容性设置
    compatibility_flags: ['nodejs_compat'],
    compatibility_date: '2023-10-30'
  },
  
  // 实验性功能
  experimental: {
    // 针对 Workers 优化
    optimizeForWorkers: true,
    // 启用 tree shaking 减少 bundle 大小
    treeShaking: true,
    // 服务端函数优化
    optimizeServerFunctions: true,
    // 禁用源响应（提高性能）
    disableOriginResponse: false
  },
  
  // 函数配置
  functions: {
    // 默认函数配置
    '*': {
      // 运行时环境
      runtime: 'edge',
      // 内存限制
      memory: 128,
      // 超时时间（秒）
      timeout: 30
    },
    
    // API 路由特定配置
    'api/*': {
      runtime: 'edge',
      memory: 128,
      timeout: 10
    }
  }
}