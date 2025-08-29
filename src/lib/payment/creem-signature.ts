// Simple hash function for compatibility
function simpleHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * 生成Creem签名
 * @param params 参数对象
 * @param apiKey API密钥
 * @returns 生成的签名
 */
export function generateSignature(params: Record<string, string>, apiKey: string): string {
  // 创建格式为 "key1=value1|key2=value2|...|salt=apiKey" 的数据字符串
  // 重要：不要对键进行排序 - 按照提供的顺序使用
  const data = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .concat(`salt=${apiKey}`)
    .join('|');

  // 使用简单哈希函数（用于演示，生产环境应使用真正的加密库）
  const hash = simpleHash(data);
  return hash;
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
export function verifyCreemSignature(params: Record<string, string>, signature: string): boolean {
  try {
    // 从配置中获取API key
    const isTestMode = process.env.CREEM_MODE?.toLowerCase() === 'test' || process.env.NODE_ENV !== 'production';
    const apiKey = isTestMode 
      ? (process.env.CREEM_SECRET_KEY_TEST || process.env.CREEM_API_KEY || 'creem_test_3sioDtbY5ADbmoODbQnNiW')
      : (process.env.CREEM_SECRET_KEY_PROD || process.env.CREEM_API_KEY || '');

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

    // 使用Creem提供的方法生成签名
    const computedSignature = generateSignature(filteredParams, apiKey);
    
    // 比较计算的签名与接收到的签名
    return computedSignature === signature;
  } catch (error) {
    console.error('Error verifying Creem signature:', error);
    return false;
  }
}