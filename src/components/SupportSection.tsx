'use client'

import { motion } from 'framer-motion'
import { Mail, MessageCircle, FileText, Phone } from 'lucide-react'

const supportOptions = [
  {
    icon: FileText,
    title: '常见问题',
    description: '查看我们的常见问题解答，快速找到解决方案。',
    action: '查看 FAQ',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Mail,
    title: '邮件支持',
    description: '发送邮件给我们的技术支持团队，我们会尽快回复。',
    action: '发送邮件',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: MessageCircle,
    title: '在线客服',
    description: '与我们的客服代表实时对话，获得即时帮助。',
    action: '开始对话',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: Phone,
    title: '电话支持',
    description: '工作日 9:00-18:00 提供电话技术支持服务。',
    action: '查看号码',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
]

export default function SupportSection() {
  return (
    <section id="support" className="section-padding bg-gray-50">
      <div className="container-custom">
        
        {/* 标题区域 */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-md mb-4">
            技术支持
          </h2>
          <p className="text-body max-w-2xl mx-auto">
            我们随时为您提供帮助。无论您遇到什么问题，都可以通过以下方式联系我们。
          </p>
        </motion.div>
        
        {/* 支持选项网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {supportOptions.map((option, index) => (
            <motion.div
              key={option.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full transition-all duration-300 group-hover:shadow-2xl group-hover:border-primary/20">
                
                {/* 图标 */}
                <motion.div 
                  className={`w-16 h-16 rounded-2xl ${option.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  <option.icon className={`w-8 h-8 ${option.color}`} />
                </motion.div>
                
                {/* 标题 */}
                <h3 className="text-xl font-semibold text-gray-text mb-4">
                  {option.title}
                </h3>
                
                {/* 描述 */}
                <p className="text-gray-secondary leading-relaxed mb-6">
                  {option.description}
                </p>
                
                {/* 按钮 */}
                <button className="w-full btn-secondary text-sm font-medium">
                  {option.action}
                </button>
                
                {/* 悬停装饰 */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* 联系信息 */}
        <motion.div 
          className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold text-gray-text mb-4">
            其他联系方式
          </h3>
          <p className="text-gray-secondary mb-8 max-w-2xl mx-auto">
            如果您有其他需求或建议，欢迎通过以下方式与我们取得联系。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-text mb-2">邮箱地址</h4>
              <p className="text-gray-secondary">support@topwindow.app</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-text mb-2">在线时间</h4>
              <p className="text-gray-secondary">工作日 9:00 - 18:00</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-gray-text mb-2">响应时间</h4>
              <p className="text-gray-secondary">24 小时内回复</p>
            </div>
          </div>
        </motion.div>
        
      </div>
    </section>
  )
}