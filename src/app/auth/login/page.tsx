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
        title="Welcome Back"
        subtitle="Sign in to your TopWindow account"
      >
        <LoginForm onSuccess={handleLoginSuccess} />
      </AuthFormContainer>
      <NetworkStatus />
    </>
  )
}