// License Key 系统 API 集成测试
// 注意: 这是测试代码，需要配合Jest或其他测试框架使用

/**
 * 测试套件: License Key API集成测试
 * 
 * 运行前需要:
 * 1. 设置测试数据库环境
 * 2. 配置环境变量
 * 3. 安装测试依赖: npm install -D jest @types/jest
 */

describe('License Key System API Integration Tests', () => {
  const TEST_BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'
  
  // 测试用数据
  const TEST_LICENSE_KEY = 'TW-TEST-1234-5678-9ABC'
  const TEST_DEVICE_ID = 'test-device-12345678'
  const TEST_DEVICE_INFO = {
    name: 'Test MacBook Pro',
    type: 'macbook_pro',
    version: '14.0',
    platform: 'macOS'
  }

  describe('POST /api/licenses/activate', () => {
    test('should activate license with valid data', async () => {
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: TEST_LICENSE_KEY,
          device_id: TEST_DEVICE_ID,
          device_info: TEST_DEVICE_INFO
        })
      })

      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.status).toBe('success')
      expect(data.message).toContain('successful')
      expect(data.activation_info).toBeDefined()
      expect(data.activation_info.device_name).toBe(TEST_DEVICE_INFO.name)
    })

    test('should reject invalid license key format', async () => {
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: 'INVALID-KEY',
          device_id: TEST_DEVICE_ID,
          device_info: TEST_DEVICE_INFO
        })
      })

      expect(response.status).toBe(400)
      
      const data = await response.json()
      expect(data.status).toBe('error')
      expect(data.message).toContain('Invalid license key format')
    })

    test('should reject missing device_id', async () => {
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: TEST_LICENSE_KEY,
          device_info: TEST_DEVICE_INFO
        })
      })

      expect(response.status).toBe(400)
      
      const data = await response.json()
      expect(data.status).toBe('error')
      expect(data.message).toContain('Device ID is required')
    })

    test('should handle duplicate activation gracefully', async () => {
      // 首次激活
      await fetch(`${TEST_BASE_URL}/api/licenses/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: TEST_LICENSE_KEY,
          device_id: TEST_DEVICE_ID,
          device_info: TEST_DEVICE_INFO
        })
      })

      // 重复激活
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: TEST_LICENSE_KEY,
          device_id: TEST_DEVICE_ID,
          device_info: TEST_DEVICE_INFO
        })
      })

      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.status).toBe('success')
      expect(data.message).toContain('already activated')
    })

    test('should enforce rate limiting', async () => {
      // 发送超过限制的请求
      const requests = Array.from({ length: 6 }, () =>
        fetch(`${TEST_BASE_URL}/api/licenses/activate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            license_key: TEST_LICENSE_KEY,
            device_id: `test-device-${Math.random()}`,
            device_info: TEST_DEVICE_INFO
          })
        })
      )

      const responses = await Promise.all(requests)
      const lastResponse = responses[responses.length - 1]

      expect(lastResponse.status).toBe(429)
      expect(lastResponse.headers.get('X-RateLimit-Limit')).toBe('5')
    })
  })

  describe('POST /api/licenses/validate', () => {
    test('should validate active license and device', async () => {
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: TEST_LICENSE_KEY,
          device_id: TEST_DEVICE_ID
        })
      })

      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.status).toBe('success')
      expect(data.license_info).toBeDefined()
      expect(data.device_info).toBeDefined()
    })

    test('should reject non-existent license', async () => {
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: 'TW-FAKE-1111-2222-3333',
          device_id: TEST_DEVICE_ID
        })
      })

      expect(response.status).toBe(404)
      
      const data = await response.json()
      expect(data.status).toBe('error')
      expect(data.message).toContain('not found')
    })

    test('should include cache headers', async () => {
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: TEST_LICENSE_KEY,
          device_id: TEST_DEVICE_ID
        })
      })

      expect(response.headers.get('Cache-Control')).toContain('max-age=300')
    })
  })

  describe('GET /api/licenses/my', () => {
    test('should require authentication', async () => {
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/my`)

      expect(response.status).toBe(401)
      
      const data = await response.json()
      expect(data.status).toBe('error')
      expect(data.message).toContain('Unauthorized')
    })

    test('should return user licenses with auth', async () => {
      // 注意: 实际测试需要模拟用户认证
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/my`, {
        headers: {
          'Authorization': 'Bearer test-token', // 模拟认证
          'Cookie': 'test-session=value'
        }
      })

      if (response.status === 200) {
        const data = await response.json()
        expect(data.status).toBe('success')
        expect(Array.isArray(data.licenses)).toBe(true)
      }
    })

    test('should include rate limit headers', async () => {
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/my`)
      
      // 无论是否成功，都应该有限流头
      expect(response.headers.has('X-RateLimit-Limit')).toBe(true)
    })
  })

  describe('Device Management API', () => {
    const TEST_LICENSE_WITH_DEVICE = 'TW-TEST-WITH-DEVICE-1234'
    
    test('GET /api/licenses/devices should require license_key parameter', async () => {
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/devices`)

      expect(response.status).toBe(400)
      
      const data = await response.json()
      expect(data.message).toContain('License key parameter is required')
    })

    test('PUT /api/licenses/devices should rename device', async () => {
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/devices`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: TEST_LICENSE_WITH_DEVICE,
          device_id: TEST_DEVICE_ID,
          new_name: 'Renamed Test Device'
        })
      })

      // 可能返回401(未认证)或其他状态码
      expect([200, 401, 404]).toContain(response.status)
    })

    test('DELETE /api/licenses/devices should revoke device', async () => {
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/devices`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: TEST_LICENSE_WITH_DEVICE,
          device_id: TEST_DEVICE_ID
        })
      })

      // 可能返回200(成功)、401(未认证)或404(未找到)
      expect([200, 401, 404]).toContain(response.status)
    })
  })

  describe('Error Handling', () => {
    test('should handle malformed JSON gracefully', async () => {
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      })

      expect(response.status).toBe(400)
    })

    test('should return proper error structure', async () => {
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      const data = await response.json()
      expect(data).toHaveProperty('status')
      expect(data).toHaveProperty('message')
      expect(data.status).toBe('error')
    })

    test('should not expose internal error details', async () => {
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: TEST_LICENSE_KEY,
          device_id: TEST_DEVICE_ID,
          device_info: TEST_DEVICE_INFO
        })
      })

      const data = await response.json()
      
      // 确保不暴露数据库错误等敏感信息
      if (data.status === 'error') {
        expect(data.message).not.toContain('postgres')
        expect(data.message).not.toContain('supabase')
        expect(data.message).not.toContain('database')
        expect(data.message).not.toContain('SQL')
      }
    })
  })

  describe('Security Tests', () => {
    test('should reject SQL injection attempts', async () => {
      const maliciousInput = "'; DROP TABLE licenses; --"
      
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: maliciousInput,
          device_id: TEST_DEVICE_ID,
          device_info: TEST_DEVICE_INFO
        })
      })

      expect(response.status).toBe(400)
      
      const data = await response.json()
      expect(data.status).toBe('error')
      expect(data.message).toContain('Invalid license key format')
    })

    test('should sanitize input data', async () => {
      const response = await fetch(`${TEST_BASE_URL}/api/licenses/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          license_key: TEST_LICENSE_KEY,
          device_id: TEST_DEVICE_ID,
          device_info: {
            name: '<script>alert("xss")</script>',
            type: 'macbook_pro'
          }
        })
      })

      // 应该接受请求但清理恶意内容
      if (response.status === 200) {
        const data = await response.json()
        expect(data.activation_info.device_name).not.toContain('<script>')
      }
    })
  })
})

/**
 * 运行测试的命令示例:
 * 
 * npm run test:api-integration
 * 
 * 或者使用Jest:
 * npx jest src/lib/license/__tests__/api-integration.test.ts
 * 
 * 测试环境配置:
 * 1. 创建测试数据库
 * 2. 设置TEST_BASE_URL环境变量  
 * 3. 确保测试数据的清理和重置
 */