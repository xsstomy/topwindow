// 许可证业务逻辑服务
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateLicenseKey } from './generator'
import { EmailService } from '@/lib/email/service'
import type { 
  GenerateLicenseParams, 
  LicenseGenerationResult,
  License,
  UserDevice,
  LicenseWithDevices 
} from '@/types/license'

const supabase = supabaseAdmin

export class LicenseService {
  /**
   * 生成新的许可证
   */
  static async generateLicense(params: GenerateLicenseParams): Promise<LicenseGenerationResult> {
    const { userId, paymentId, productId } = params

    try {
      // 获取产品信息
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('is_active', true)
        .single()

      if (productError || !product) {
        throw new Error(`Product not found: ${productId}`)
      }

      // 生成唯一的许可证密钥
      let licenseKey: string
      let attempts = 0
      const maxAttempts = 10

      do {
        licenseKey = generateLicenseKey()
        attempts++
        
        // 检查密钥是否已存在
        const { data: existing } = await supabase
          .from('licenses')
          .select('license_key')
          .eq('license_key', licenseKey)
          .single()

        if (!existing) break

        if (attempts >= maxAttempts) {
          throw new Error('Failed to generate unique license key')
        }
      } while (attempts < maxAttempts)

      // 插入许可证记录
      const { data: license, error: licenseError } = await supabase
        .from('licenses')
        .insert({
          license_key: licenseKey,
          user_id: userId,
          payment_id: paymentId,
          product_id: productId,
          status: 'active',
          activation_limit: product.activation_limit || 1,
          activated_devices: [],
          metadata: {
            generated_at: new Date().toISOString(),
            product_info: {
              name: product.name,
              price: product.price,
              currency: product.currency
            }
          }
        } as any)
        .select()
        .single()

      if (licenseError) {
        throw licenseError
      }

      console.log(`License generated successfully: ${licenseKey} for user ${userId}`)

      // 获取用户信息用于发送邮件
      const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId)
      
      if (userError || !user) {
        console.warn(`Could not fetch user info for license email: ${userId}`)
      } else {
        // 异步发送许可证邮件，不阻塞许可证生成
        this.sendLicenseEmailAsync({
          userEmail: user.user.email!,
          userName: user.user.user_metadata?.full_name || user.user.email!,
          licenseKey,
          productName: product.name,
          activationLimit: product.activation_limit || 1
        }).catch(emailError => {
          console.error('Failed to send license email:', emailError)
          // 邮件发送失败不应影响许可证生成流程
        })
      }

      return {
        license_key: licenseKey,
        user_id: userId,
        product_id: productId,
        activation_limit: product.activation_limit || 1
      }

    } catch (error) {
      console.error('Generate license error:', error)
      throw error
    }
  }

  /**
   * 获取许可证详细信息
   */
  static async getLicenseDetails(licenseKey: string): Promise<License | null> {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .eq('license_key', licenseKey)
        .single()

      if (error) {
        console.error('Get license details error:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Get license details error:', error)
      return null
    }
  }

  /**
   * 获取用户在特定产品下的总设备激活数量
   * 这个方法实现新的激活限制检查逻辑：按产品而非按许可证
   */
  static async getUserProductDeviceCount(userId: string, productId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('user_devices')
        .select('id, licenses!inner(product_id)')
        .eq('licenses.user_id', userId)
        .eq('licenses.product_id', productId)
        .eq('status', 'active')

      if (error) {
        console.error('Get user product device count error:', error)
        return 0
      }

      return data?.length || 0
    } catch (error) {
      console.error('Get user product device count error:', error)
      return 0
    }
  }

  /**
   * 激活设备
   */
  static async activateDevice(
    licenseKey: string,
    deviceId: string,
    deviceInfo: any
  ): Promise<{ success: boolean; message: string; deviceData?: UserDevice }> {
    try {
      // 获取许可证信息
      const license = await this.getLicenseDetails(licenseKey)
      if (!license) {
        return { success: false, message: 'License not found' }
      }

      // 检查设备是否已激活
      const { data: existingDevice } = await supabase
        .from('user_devices')
        .select('*')
        .eq('license_key', licenseKey)
        .eq('device_id', deviceId)
        .single()

      if (existingDevice) {
        // 设备已存在时，只更新设备信息，不重复计数
        const { data: updatedDevice, error: updateError } = await supabase
          .from('user_devices')
          .update({
            last_seen_at: new Date().toISOString(),
            device_info: deviceInfo,
            device_name: deviceInfo.name || existingDevice.device_name,
            // 确保设备状态为激活状态（防止之前被撤销的设备重新激活）
            status: 'active'
          } as any)
          .eq('id', existingDevice.id)
          .select()
          .single()

        if (updateError) {
          throw updateError
        }

        return {
          success: true,
          message: 'Device already activated. Information updated',
          deviceData: updatedDevice
        }
      }

      // 获取产品信息用于检查激活限制
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', license.product_id)
        .single()

      if (productError || !product) {
        return { success: false, message: 'Product information not found' }
      }

      // 检查用户在该产品下的总设备激活数量（新逻辑）
      const userProductDeviceCount = await this.getUserProductDeviceCount(license.user_id, license.product_id)
      
      if (userProductDeviceCount >= product.activation_limit) {
        return {
          success: false,
          message: `Product activation limit reached (${userProductDeviceCount}/${product.activation_limit}). Total devices across all licenses for this product.`
        }
      }

      // 创建新的设备激活记录
      const { data: newDevice, error: deviceError } = await supabase
        .from('user_devices')
        .insert({
          user_id: license.user_id,
          license_key: licenseKey,
          device_id: deviceId,
          device_name: deviceInfo.name || 'Unknown Device',
          device_type: deviceInfo.type || 'mac',
          device_info: deviceInfo,
          status: 'active'
        } as any)
        .select()
        .single()

      if (deviceError) {
        throw deviceError
      }

      // 更新许可证的最后验证时间
      await supabase
        .from('licenses')
        .update({ last_validated_at: new Date().toISOString() } as any)
        .eq('license_key', licenseKey)

      return {
        success: true,
        message: 'Device activated successfully',
        deviceData: newDevice
      }

    } catch (error) {
      console.error('Activate device error:', error)
      return {
        success: false,
        message: 'Failed to activate device'
      }
    }
  }

  /**
   * 验证许可证和设备
   */
  static async validateLicenseAndDevice(
    licenseKey: string,
    deviceId: string
  ): Promise<{ isValid: boolean; message: string; licenseData?: any; deviceData?: any }> {
    try {
      // 查询许可证和设备信息
      const { data, error } = await supabase
        .from('licenses')
        .select(`
          *,
          user_devices!inner(*)
        `)
        .eq('license_key', licenseKey)
        .eq('user_devices.device_id', deviceId)
        .eq('user_devices.status', 'active')
        .single()

      if (error || !data) {
        return {
          isValid: false,
          message: 'License or device not found'
        }
      }

      const license = data
      const device = data.user_devices[0]

      // 检查许可证状态
      if (license.status !== 'active') {
        return {
          isValid: false,
          message: `License is ${license.status}`
        }
      }

      // 检查过期时间
      if (license.expires_at) {
        const expiryDate = new Date(license.expires_at)
        const now = new Date()

        if (expiryDate < now) {
          // 更新许可证状态为过期
          await supabase
            .from('licenses')
            .update({ status: 'expired' } as any)
            .eq('license_key', licenseKey)

          return {
            isValid: false,
            message: 'License has expired'
          }
        }
      }

      // 更新设备最后活跃时间
      await supabase
        .from('user_devices')
        .update({ last_seen_at: new Date().toISOString() } as any)
        .eq('license_key', licenseKey)
        .eq('device_id', deviceId)

      // 更新许可证最后验证时间
      await supabase
        .from('licenses')
        .update({ last_validated_at: new Date().toISOString() } as any)
        .eq('license_key', licenseKey)

      return {
        isValid: true,
        message: 'License and device are valid',
        licenseData: {
          expires_at: license.expires_at,
          status: license.status,
          last_validated_at: new Date().toISOString()
        },
        deviceData: {
          last_seen_at: new Date().toISOString(),
          device_name: device.device_name
        }
      }

    } catch (error) {
      console.error('Validate license and device error:', error)
      return {
        isValid: false,
        message: 'Validation failed'
      }
    }
  }

  /**
   * 获取用户的所有许可证
   */
  static async getUserLicenses(userId: string): Promise<LicenseWithDevices[]> {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .select(`
          *,
          user_devices(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Get user licenses error:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Get user licenses error:', error)
      return []
    }
  }

  /**
   * 获取许可证的设备列表
   */
  static async getLicenseDevices(licenseKey: string, userId: string): Promise<UserDevice[]> {
    try {
      // 验证用户拥有此许可证
      const { data: license, error: licenseError } = await supabase
        .from('licenses')
        .select('user_id')
        .eq('license_key', licenseKey)
        .eq('user_id', userId)
        .single()

      if (licenseError || !license) {
        return []
      }

      // 获取设备列表
      const { data: devices, error: devicesError } = await supabase
        .from('user_devices')
        .select('*')
        .eq('license_key', licenseKey)
        .order('first_activated_at', { ascending: false })

      if (devicesError) {
        console.error('Get license devices error:', devicesError)
        return []
      }

      return devices || []
    } catch (error) {
      console.error('Get license devices error:', error)
      return []
    }
  }

  /**
   * 重命名设备
   */
  static async renameDevice(
    licenseKey: string,
    deviceId: string,
    newName: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // 验证权限并更新设备名称
      const { data, error } = await supabase
        .from('user_devices')
        .update({ device_name: newName } as any)
        .eq('license_key', licenseKey)
        .eq('device_id', deviceId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error || !data) {
        return {
          success: false,
          message: 'Device not found or access denied'
        }
      }

      return {
        success: true,
        message: 'Device renamed successfully'
      }
    } catch (error) {
      console.error('Rename device error:', error)
      return {
        success: false,
        message: 'Failed to rename device'
      }
    }
  }

  /**
   * 撤销设备
   */
  static async revokeDevice(
    licenseKey: string,
    deviceId: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // 验证权限并撤销设备
      const { data, error } = await supabase
        .from('user_devices')
        .update({ status: 'revoked' } as any)
        .eq('license_key', licenseKey)
        .eq('device_id', deviceId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error || !data) {
        return {
          success: false,
          message: 'Device not found or access denied'
        }
      }

      return {
        success: true,
        message: 'Device revoked successfully'
      }
    } catch (error) {
      console.error('Revoke device error:', error)
      return {
        success: false,
        message: 'Failed to revoke device'
      }
    }
  }

  /**
   * 异步发送许可证邮件
   */
  private static async sendLicenseEmailAsync(params: {
    userEmail: string
    userName: string
    licenseKey: string
    productName: string
    activationLimit: number
  }): Promise<void> {
    try {
      const result = await EmailService.sendLicenseEmail(params)
      
      if (result.success) {
        console.log(`License email sent successfully to ${params.userEmail}, Message ID: ${result.messageId}`)
      } else {
        console.error(`License email send failed: ${result.error}`)
      }
    } catch (error) {
      console.error('License email send error:', error)
      throw error
    }
  }

  /**
   * 手动重发许可证邮件
   */
  static async resendLicenseEmail(
    licenseKey: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // 验证许可证存在且属于用户
      const license = await this.getLicenseDetails(licenseKey)
      if (!license || license.user_id !== userId) {
        return {
          success: false,
          message: 'License not found or access denied'
        }
      }

      // 获取用户信息
      const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId)
      if (userError || !user) {
        return {
          success: false,
          message: 'User information not found'
        }
      }

      // 获取产品信息
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', license.product_id)
        .single()

      if (productError || !product) {
        return {
          success: false,
          message: 'Product information not found'
        }
      }

      // 发送邮件
      const result = await EmailService.sendLicenseEmail({
        userEmail: user.user.email!,
        userName: user.user.user_metadata?.full_name || user.user.email!,
        licenseKey,
        productName: product.name,
        activationLimit: license.activation_limit
      })

      if (result.success) {
        console.log(`License email resent successfully: ${licenseKey} to ${user.user.email}`)
        return {
          success: true,
          message: 'License email sent successfully'
        }
      } else {
        return {
          success: false,
          message: `Failed to send email: ${result.error}`
        }
      }

    } catch (error) {
      console.error('Resend license email error:', error)
      return {
        success: false,
        message: 'Failed to resend license email'
      }
    }
  }

  /**
   * 批量发送许可证邮件（用于数据恢复或批量操作）
   */
  static async batchSendLicenseEmails(
    userId: string,
    options: { 
      resendAll?: boolean,
      licenseKeys?: string[]
    } = {}
  ): Promise<{
    success: number
    failed: number
    details: Array<{ licenseKey: string; success: boolean; error?: string }>
  }> {
    try {
      const userLicenses = await this.getUserLicenses(userId)
      
      let targetLicenses = userLicenses
      if (options.licenseKeys) {
        targetLicenses = userLicenses.filter(license => 
          options.licenseKeys!.includes(license.license_key)
        )
      }

      const results = {
        success: 0,
        failed: 0,
        details: [] as Array<{ licenseKey: string; success: boolean; error?: string }>
      }

      for (const license of targetLicenses) {
        try {
          const result = await this.resendLicenseEmail(license.license_key, userId)
          
          if (result.success) {
            results.success++
            results.details.push({
              licenseKey: license.license_key,
              success: true
            })
          } else {
            results.failed++
            results.details.push({
              licenseKey: license.license_key,
              success: false,
              error: result.message
            })
          }

          // 添加延迟以避免邮件服务限流
          await new Promise(resolve => setTimeout(resolve, 1000))

        } catch (error) {
          results.failed++
          results.details.push({
            licenseKey: license.license_key,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      console.log(`Batch license email send completed: ${results.success} success, ${results.failed} failed`)
      
      return results

    } catch (error) {
      console.error('Batch send license emails error:', error)
      throw error
    }
  }
}

// 便捷函数导出
export const {
  generateLicense,
  getLicenseDetails,
  getUserProductDeviceCount,
  activateDevice,
  validateLicenseAndDevice,
  getUserLicenses,
  getLicenseDevices,
  renameDevice,
  revokeDevice,
  resendLicenseEmail,
  batchSendLicenseEmails
} = LicenseService

// TESTING-GUIDE: 需覆盖用例
// 1. 许可证生成测试 - 成功生成/产品不存在/重复密钥处理
// 2. 设备激活测试 - 首次激活/重复激活/超出限制
// 3. 许可证验证测试 - 有效许可证/过期许可证/撤销许可证
// 4. 设备管理测试 - 重命名/撤销/权限验证