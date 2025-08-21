import AuthForm from '@/components/AuthForm'
import NetworkStatus from '@/components/NetworkStatus'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm mode="register" />
      <NetworkStatus />
    </div>
  )
}