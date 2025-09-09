import { createHmac, timingSafeEqual as nodeTimingSafeEqual } from 'node:crypto'

// Fallback timing-safe compare
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  try {
    return nodeTimingSafeEqual(ab, bb)
  } catch {
    // Constant-time fallback
    let result = 0
    for (let i = 0; i < ab.length; i++) {
      result |= ab[i] ^ bb[i]
    }
    return result === 0
  }
}

/**
 * 生成Creem签名
 * @param params 参数对象
 * @param apiKey API密钥
 * @returns 生成的签名
 */
export function generateSignature(params: Record<string, string>, apiKey: string): string {
  // Deprecated legacy helper kept for backwards compatibility in tests.
  // Use HMAC on raw body instead (see verifyCreemSignatureFromRawBody).
  const data = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .concat(`salt=${apiKey}`)
    .join('|')
  return createHmac('sha256', apiKey).update(data, 'utf8').digest('hex')
}

export interface RedirectParams {
  request_id?: string | null;
  checkout_id?: string | null;
  order_id?: string | null;
  customer_id?: string | null;
  subscription_id?: string | null;
  product_id?: string | null;
}

/**
 * 验证Creem签名 - 用于webhook和回调验证
 * @param params 重定向参数
 * @param signature 要验证的签名
 * @returns 签名是否有效
 */
export function verifyCreemSignature(
  params: Record<string, string>,
  signature: string,
  secretOverride?: string
): boolean {
  try {
    // 优先使用传入的 webhook secret，其次回退到环境变量（兼容旧逻辑）
    const isTestMode =
      process.env.CREEM_MODE?.toLowerCase() === 'test' ||
      process.env.NODE_ENV !== 'production';
    const apiKey =
      secretOverride ||
      (isTestMode
        ? process.env.CREEM_WEBHOOK_SECRET_TEST ||
          process.env.CREEM_SECRET_KEY_TEST ||
          process.env.CREEM_API_KEY ||
          'creem_test_webhook_secret'
        : process.env.CREEM_WEBHOOK_SECRET_PROD ||
          process.env.CREEM_SECRET_KEY_PROD ||
          process.env.CREEM_API_KEY ||
          '');

    if (!apiKey) {
      console.error('Creem API key not found for signature verification');
      return false;
    }

    // 过滤掉null/undefined值，并移除signature参数（如果存在）
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== 'signature') {
        filteredParams[key] = value;
      }
    });

    // 旧格式（参数拼接）— 仅用于兼容老回调；主流应使用原始 body HMAC 校验
    const computedSignature = generateSignature(filteredParams, apiKey)
    return safeEqual(signature, computedSignature)
  } catch (error) {
    console.error('Error verifying Creem signature:', error);
    return false;
  }
}

/**
 * 使用原始请求体 + Webhook Signing Secret 进行 HMAC-SHA256 验签
 */
export function verifyCreemSignatureFromRawBody(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hex = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex')
    const b64 = createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64')
    return safeEqual(signature, hex) || safeEqual(signature, b64)
  } catch (error) {
    console.error('Error verifying raw-body HMAC signature:', error)
    return false
  }
}
