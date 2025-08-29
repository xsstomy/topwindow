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
        title="Create Account"
        subtitle="Join TopWindow and start managing your windows"
      >
        <RegisterForm onSuccess={handleRegisterSuccess} />
      </AuthFormContainer>
      <NetworkStatus />
    </>
  )
}