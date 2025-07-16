/**
 * 用户认证API接口
 */
import request, { ApiResponse } from '../utils/request'

// 用户信息类型定义
export interface UserInfo {
  id: number
  nickname: string
  avatar: string
  phone: string
  openid?: string
  unionid?: string
  createdAt: string
  updatedAt: string
}

// 用户统计类型定义
export interface UserStats {
  studyDays: number
  practiceCount: number
  correctRate: number
  totalScore: number
}

// 微信登录参数
export interface WechatLoginParams {
  code: string
  userInfo: any
  signature: string
  rawData: string
  encryptedData: string
  iv: string
}

// 手机号登录参数
export interface PhoneLoginParams {
  encryptedData: string
  iv: string
  code: string
}

// 验证码登录参数
export interface VerifyCodeLoginParams {
  phone: string
  code: string
}

// 用户认证API类
class AuthApi {
  /**
   * 微信用户授权登录
   */
  async wechatLogin(params: WechatLoginParams): Promise<ApiResponse<{ user: UserInfo; token: string }>> {
    return request.post('/auth/wechat-login', params)
  }

  /**
   * 微信手机号登录
   */
  async phoneLogin(params: PhoneLoginParams): Promise<ApiResponse<{ user: UserInfo; token: string }>> {
    return request.post('/auth/phone-login', params)
  }

  /**
   * 发送验证码
   */
  async sendVerifyCode(phone: string): Promise<ApiResponse<any>> {
    return request.post('/auth/send-code', { phone })
  }

  /**
   * 验证码登录
   */
  async verifyCodeLogin(params: VerifyCodeLoginParams): Promise<ApiResponse<{ user: UserInfo; token: string }>> {
    return request.post('/auth/verify-login', params)
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(): Promise<ApiResponse<UserInfo>> {
    return request.get('/auth/user-info')
  }

  /**
   * 获取用户统计数据
   */
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return request.get('/auth/user-stats')
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo(userInfo: Partial<UserInfo>): Promise<ApiResponse<UserInfo>> {
    return request.put('/auth/user-info', userInfo)
  }

  /**
   * 退出登录
   */
  async logout(): Promise<ApiResponse<any>> {
    return request.post('/auth/logout')
  }

  /**
   * 刷新Token
   */
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return request.post('/auth/refresh-token')
  }
}

// 创建认证API实例
const authApi = new AuthApi()

export default authApi