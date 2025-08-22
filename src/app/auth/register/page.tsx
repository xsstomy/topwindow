'use client'

import { useRouter } from 'next/navigation'
import AuthFormContainer from '@/components/auth/AuthFormContainer'
import RegisterForm from '@/components/auth/RegisterForm'
import NetworkStatus from '@/components/NetworkStatus'

export default function RegisterPage() {
  const router = useRouter()

  const handleRegisterSuccess = () => {
    router.push('/dashboard')
  }

  return (
    <>
      <AuthFormContainer
        title="创建账户"
        subtitle="加入 TopWindow，开始管理您的窗口"
      >
        <RegisterForm onSuccess={handleRegisterSuccess} />
      </AuthFormContainer>
      <NetworkStatus />
    </>
  )
}