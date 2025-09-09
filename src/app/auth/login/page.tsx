"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import AuthFormContainer from '@/components/auth/AuthFormContainer'
import LoginForm from '@/components/auth/LoginForm'
import NetworkStatus from '@/components/NetworkStatus'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextParam = searchParams.get('next')

  const handleLoginSuccess = () => {
    router.push(nextParam || '/dashboard')
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
