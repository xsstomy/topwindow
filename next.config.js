/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: false
  },
  
  // 添加重定向规则
  async redirects() {
    return [
      {
        source: '/auth',
        destination: '/auth/login',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig