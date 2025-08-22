// License Key 测试说明组件
import { Info, CheckCircle, AlertTriangle } from 'lucide-react'

export default function TestInstructions() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <div className="flex items-start gap-3">
        <Info className="w-6 h-6 text-blue-600 mt-0.5" />
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-3">如何使用此测试页面</h3>
          
          <div className="space-y-4 text-blue-800">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">License Key 生成器测试</h4>
                <p className="text-sm text-blue-700">
                  点击"生成新密钥"按钮测试单个密钥生成，或使用"批量生成"测试批量创建。
                  所有生成的密钥都应该符合 TW-XXXX-XXXX-XXXX-XXXX 格式。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">格式验证器测试</h4>
                <p className="text-sm text-blue-700">
                  在输入框中输入任意字符串测试格式验证。使用快速测试用例按钮可以快速填入有效或无效的示例。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">输入验证器测试</h4>
                <p className="text-sm text-blue-700">
                  点击"运行验证测试"执行预定义的测试用例，验证各种输入格式的验证逻辑是否正确。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">数据库连接测试</h4>
                <p className="text-sm text-blue-700">
                  测试 Supabase 数据库连接。如果连接失败，请检查环境变量配置和数据库表结构。
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
            <p className="text-sm text-amber-800">
              <strong>注意：</strong> 此页面仅用于开发测试，不会保存任何数据到生产环境。
              所有测试操作都是安全的。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}