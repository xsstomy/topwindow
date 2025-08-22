export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            隐私政策
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              最后更新时间：2024年8月22日
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              1. 信息收集
            </h2>
            <p className="text-gray-700 mb-4">
              我们收集您提供的信息，如注册时的邮箱地址和姓名。
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. 信息使用
            </h2>
            <p className="text-gray-700 mb-4">
              我们使用收集的信息来提供、维护和改善我们的服务。
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              3. 信息保护
            </h2>
            <p className="text-gray-700 mb-4">
              我们采用适当的安全措施来保护您的个人信息。
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              4. 联系我们
            </h2>
            <p className="text-gray-700 mb-4">
              如果您对我们的隐私政策有任何疑问，请通过我们的支持页面联系我们。
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}