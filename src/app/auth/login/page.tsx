'use client'

import { useRouter } from 'next/navigation'
import AuthFormContainer from '@/components/auth/AuthFormContainer'
import LoginForm from '@/components/auth/LoginForm'
import NetworkStatus from '@/components/NetworkStatus'

export default function LoginPage() {
  const router = useRouter()

  const handleLoginSuccess = () => {
    router.push('/dashboard')
  }

  return (
    <>
      <AuthFormContainer
        title="欢迎回来"
        subtitle="登录您的 TopWindow 账户"
      >
        <LoginForm onSuccess={handleLoginSuccess} />
      </AuthFormContainer>
      <NetworkStatus />
    </>
  )
}