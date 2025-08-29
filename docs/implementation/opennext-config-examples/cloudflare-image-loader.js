/**
 * Cloudflare Workers 环境下的图片加载器
 * 支持 Cloudflare Images 优化服务和回退策略
 * 
 * 用法：在 next.config.js 中配置
 * images: {
 *   loader: 'custom',
 *   loaderFile: './lib/cloudflare-image-loader.js'
 * }
 */

/**
 * 主要的图片加载器函数
 * @param {Object} params - 图片参数
 * @param {string} params.src - 图片源路径
 * @param {number} params.width - 图片宽度
 * @param {number} [params.quality] - 图片质量 (1-100)
 * @returns {string} 优化后的图片URL
 */
export default function cloudflareLoader({ src, width, quality }) {
  const params = new URLSearchParams()
  params.set('width', width.toString())
  
  if (quality) {
    params.set('quality', quality.toString())
  }
  
  // 处理完整的外部URL
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return handleExternalImage(src, width, quality)
  }
  
  // 处理相对路径
  if (src.startsWith('/')) {
    return handleLocalImage(src, width, quality)
  }
  
  // 默认处理
  return `/_next/image?url=${encodeURIComponent(src)}&${params}`
}

/**
 * 处理外部图片URL
 * @param {string} src - 外部图片URL
 * @param {number} width - 图片宽度
 * @param {number} quality - 图片质量
 * @returns {string} 优化后的URL
 */
function handleExternalImage(src, width, quality) {
  // Cloudflare Images 账户ID（从环境变量获取）
  const accountId = process.env.CLOUDFLARE_IMAGES_ACCOUNT_ID
  
  if (accountId) {
    // 使用 Cloudflare Images Polish 服务
    const options = []
    options.push(`width=${width}`)
    
    if (quality) {
      options.push(`quality=${quality}`)
    }
    
    // 对于外部图片，可以使用 Polish 服务
    return `${src}?cf_polish=lossy&${options.join('&')}`
  }
  
  // 回退：直接返回原URL带参数
  const params = new URLSearchParams()
  params.set('w', width.toString())
  if (quality) params.set('q', quality.toString())
  
  return `${src}${src.includes('?') ? '&' : '?'}${params}`
}

/**
 * 处理本地图片
 * @param {string} src - 本地图片路径
 * @param {number} width - 图片宽度
 * @param {number} quality - 图片质量
 * @returns {string} 优化后的URL
 */
function handleLocalImage(src, width, quality) {
  const accountId = process.env.CLOUDFLARE_IMAGES_ACCOUNT_ID
  const deliveryUrl = process.env.CLOUDFLARE_IMAGES_DELIVERY_URL
  
  // 如果配置了 Cloudflare Images
  if (accountId && deliveryUrl) {
    // 将本地路径转换为 Cloudflare Images URL
    const imageId = src.replace(/^\//, '').replace(/\//g, '-')
    return `${deliveryUrl}/${imageId}/w=${width},q=${quality || 75},f=auto`
  }
  
  // 使用 R2 存储的图片
  if (process.env.CLOUDFLARE_R2_PUBLIC_URL) {
    const baseUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL
    return `${baseUrl}${src}?w=${width}&q=${quality || 75}`
  }
  
  // 回退到 Next.js 默认处理
  const params = new URLSearchParams()
  params.set('url', src)
  params.set('w', width.toString())
  if (quality) params.set('q', quality.toString())
  
  return `/_next/image?${params}`
}

/**
 * 获取支持的图片尺寸
 * @returns {number[]} 支持的宽度数组
 */
export function getImageSizes() {
  return [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]
}

/**
 * 获取设备尺寸配置
 * @returns {Object} 设备尺寸配置
 */
export function getDeviceSizes() {
  return {
    mobile: 640,
    tablet: 768,
    laptop: 1024,
    desktop: 1280
  }
}

/**
 * 预加载关键图片
 * @param {string} src - 图片源
 * @param {Object} options - 选项
 */
export function preloadImage(src, options = {}) {
  const { width = 1200, quality = 75, priority = false } = options
  
  const optimizedSrc = cloudflareLoader({ src, width, quality })
  
  if (typeof document !== 'undefined') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = optimizedSrc
    
    if (priority) {
      link.fetchPriority = 'high'
    }
    
    document.head.appendChild(link)
  }
}

/**
 * 生成响应式图片的 srcset
 * @param {string} src - 图片源
 * @param {Object} options - 选项
 * @returns {string} srcset 字符串
 */
export function generateSrcSet(src, options = {}) {
  const { quality = 75, sizes = getImageSizes() } = options
  
  return sizes
    .map(width => {
      const optimizedSrc = cloudflareLoader({ src, width, quality })
      return `${optimizedSrc} ${width}w`
    })
    .join(', ')
}

/**
 * 图片格式检测和转换
 * @param {string} src - 图片源
 * @returns {string} 优化的格式
 */
export function getOptimalFormat(src) {
  // 检查浏览器支持
  if (typeof window !== 'undefined') {
    // WebP 支持检测
    const canvas = document.createElement('canvas')
    const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    
    if (webpSupported) {
      return 'webp'
    }
  }
  
  // 回退到原格式
  const ext = src.split('.').pop()?.toLowerCase()
  return ext || 'jpg'
}