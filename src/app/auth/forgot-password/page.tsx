'use client'

import AuthFormContainer from '@/components/auth/AuthFormContainer'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 这里将来集成 Supabase 重置密码功能
      await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟API调用
      setSent(true)
    } catch (err: any) {
      setError(err.message || '发送重置邮件失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthFormContainer
      title="重置密码"
      subtitle="输入您的邮箱地址，我们将发送重置链接"
    >
      {sent ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            邮件已发送
          </h3>
          <p className="text-gray-600 mb-6">
            我们已向 {email} 发送了密码重置链接，请检查您的邮箱。
          </p>
          <Link
            href="/auth/login"
            className="text-primary hover:text-primary-dark font-medium"
          >
            返回登录
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              邮箱地址
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white/50"
                placeholder="输入您的邮箱地址"
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {loading && (
              <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <span className={loading ? 'invisible' : ''}>发送重置邮件</span>
          </motion.button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              返回登录
            </Link>
          </div>
        </form>
      )}
    </AuthFormContainer>
  )
}