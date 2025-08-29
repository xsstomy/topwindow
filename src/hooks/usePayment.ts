'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/lib/context/AuthContext'
import PaymentUIService from '@/lib/payment/ui-service'
import { 
  PaymentSessionConfig, 
  PaymentStatus, 
  ProductInfo, 
  PaymentError 
} from '@/types/payment-ui'

export function usePayment() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<PaymentError | null>(null)

  const createPaymentSession = useCallback(async (config: PaymentSessionConfig) => {
    if (!user) {
      throw new Error('用户未登录')
    }

    setLoading(true)
    setError(null)

    try {
      const session = await PaymentUIService.createPaymentSession({
        ...config,
        customer_email: config.customer_email || user.email!
      })

      return session
    } catch (err) {
      const paymentError = err as PaymentError
      setError(paymentError)
      throw paymentError
    } finally {
      setLoading(false)
    }
  }, [user])

  const redirectToPayment = useCallback((sessionUrl: string) => {
    PaymentUIService.redirectToPayment(sessionUrl)
  }, [])

  return {
    user,
    loading,
    error,
    createPaymentSession,
    redirectToPayment,
    clearError: () => setError(null)
  }
}

export function usePaymentStatus(paymentId: string, autoRefresh = true, interval = 5000) {
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.PENDING)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const checkStatus = useCallback(async () => {
    if (!paymentId) return

    try {
      setLoading(true)
      const currentStatus = await PaymentUIService.trackPaymentStatus(paymentId)
      setStatus(currentStatus)
      setError(null)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [paymentId])

  useEffect(() => {
    if (!paymentId) return

    checkStatus()

    if (autoRefresh && (status === PaymentStatus.PENDING || status === PaymentStatus.PROCESSING)) {
      const timer = setInterval(checkStatus, interval)
      return () => clearInterval(timer)
    }
  }, [paymentId, autoRefresh, interval, status, checkStatus])

  return {
    status,
    loading,
    error,
    checkStatus,
    isCompleted: status === PaymentStatus.COMPLETED,
    isFailed: status === PaymentStatus.FAILED,
    isCancelled: status === PaymentStatus.CANCELLED,
    isPending: status === PaymentStatus.PENDING || status === PaymentStatus.PROCESSING
  }
}

export function useProductInfo(productId: string) {
  const [product, setProduct] = useState<ProductInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!productId) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const productInfo = await PaymentUIService.getProductInfo(productId)
        setProduct(productInfo)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  return { product, loading, error }
}

export function usePaymentRetry(paymentFn: Function, maxRetries = 3) {
  const [retryCount, setRetryCount] = useState(0)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  const retry = useCallback(async (...args: any[]) => {
    if (retryCount >= maxRetries) {
      throw new Error(`已达到最大重试次数 (${maxRetries})`)
    }

    setLoading(true)
    try {
      const result = await paymentFn(...args)
      setError(null)
      setRetryCount(0)
      return result
    } catch (err) {
      setError(err as Error)
      setRetryCount(prev => prev + 1)
      throw err
    } finally {
      setLoading(false)
    }
  }, [paymentFn, retryCount, maxRetries])

  const reset = useCallback(() => {
    setRetryCount(0)
    setError(null)
    setLoading(false)
  }, [])

  return { 
    retry, 
    retryCount, 
    error, 
    loading,
    canRetry: retryCount < maxRetries,
    reset
  }
}