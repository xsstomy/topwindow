export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            服务条款
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              最后更新时间：2024年8月22日
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              1. 服务条款的接受
            </h2>
            <p className="text-gray-700 mb-4">
              欢迎使用 TopWindow。通过访问或使用我们的服务，您同意受这些服务条款的约束。
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. 服务描述
            </h2>
            <p className="text-gray-700 mb-4">
              TopWindow 是一款 macOS 应用程序，允许用户将任何窗口置顶显示。
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              3. 许可证使用
            </h2>
            <p className="text-gray-700 mb-4">
              购买许可证后，您获得在指定数量设备上使用 TopWindow 的权利。
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              4. 联系我们
            </h2>
            <p className="text-gray-700 mb-4">
              如果您对这些条款有任何疑问，请通过我们的支持页面联系我们。
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}