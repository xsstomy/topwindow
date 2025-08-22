// License Key 测试页面布局
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'License Key 系统测试 - TopWindow',
  description: 'TopWindow License Key 生成器和验证器测试页面',
  robots: 'noindex, nofollow' // 防止搜索引擎索引测试页面
}

export default function TestLicenseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 测试页面标识 */}
      <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
        <div className="container mx-auto">
          <p className="text-yellow-800 text-sm font-medium">
            ⚠️ 这是开发测试页面 - 仅用于License Key系统功能验证
          </p>
        </div>
      </div>

      {/* 主要内容区域 */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* 测试页面脚注 */}
      <footer className="border-t border-gray-200 bg-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            TopWindow License Key System Test Suite - 开发环境专用
          </p>
        </div>
      </footer>
    </div>
  )
}