/**
 * 用户相关的类型定义
 */

// 用户基本信息 (根据后端API结构更新)
export interface User {
  id?: number
  username?: string
  nickname?: string
  avatarUrl?: string
  gender?: number // 0-未知，1-男，2-女  
  birthday?: string
  bio?: string
  phone?: string
  phoneVerified?: number // 0-未验证，1-已验证
  email?: string
  emailVerified?: number // 0-未验证，1-已验证
  password?: string
  wechatOpenid?: string
  wechatUnionid?: string
  wechatNickname?: string
  wechatAvatar?: string
  qqOpenid?: string
  qqNickname?: string
  qqAvatar?: string
  status?: number // 0-禁用，1-正常，2-锁定
  loginType?: string // phone,email,wechat,qq
  lastLoginTime?: string
  lastLoginIp?: string
  createdAt?: string
  updatedAt?: string
  createdBy?: number
  updatedBy?: number
  version?: number
  isDeleted?: number // 0-未删除，1-已删除
  deletedAt?: string
}

// 用户登录请求
export interface LoginRequest {
  loginType: 'phone' | 'email' | 'wechat' | 'qq'
  phone?: string
  email?: string
  password?: string
  code?: string // 验证码
  wechatCode?: string // 微信授权码
  qqAccessToken?: string // QQ访问令牌
}

// 用户登录响应
export interface LoginResponse {
  user: User
  token: string
  refreshToken?: string
  expiresIn?: number
}

// 用户注册请求
export interface RegisterRequest {
  loginType: 'phone' | 'email'
  phone?: string
  email?: string
  password: string
  code: string // 验证码
  nickname?: string
  studentId?: string
}

// 用户信息更新请求
export interface UpdateUserRequest {
  nickname?: string
  avatarUrl?: string
  gender?: number
  birthday?: string
  bio?: string
  studentId?: string
  school?: string
  major?: string
  className?: string
  grade?: string
}

// 修改密码请求
export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

// 绑定第三方账号请求
export interface BindAccountRequest {
  type: 'wechat' | 'qq' | 'phone' | 'email'
  wechatCode?: string
  qqAccessToken?: string
  phone?: string
  email?: string
  code?: string // 验证码
}

// 发送验证码请求
export interface SendCodeRequest {
  type: 'phone' | 'email'
  phone?: string
  email?: string
  scene: 'register' | 'login' | 'reset_password' | 'bind'
}

// 用户统计信息
export interface UserStats {
  studyDays: number
  practiceCount: number
  testCount: number
  averageScore: number
  totalStudyTime: number
  weeklyStudyTime: number
  monthlyStudyTime: number
}

// 用户学习记录
export interface StudyRecord {
  id: number
  userId: number
  type: 'study' | 'practice' | 'test'
  title: string
  content?: string
  score?: number
  duration: number // 学习时长（分钟）
  status: 'completed' | 'in_progress' | 'paused'
  createdAt: string
  updatedAt: string
}

// 用户登录日志
export interface UserLoginLog {
  id?: number
  userId?: number
  loginType?: string // phone,email,wechat,qq
  loginIp?: string
  userAgent?: string
  loginStatus?: number // 0-失败，1-成功
  loginTime?: string
  remark?: string
}

// 分页查询参数 (根据后端API结构)
export interface PageParams<T = any> {
  page?: number
  size?: number
  asc?: string
  desc?: string
  params?: T
}

// 后端响应格式
export interface ResponseUtils<T = any> {
  code: number
  msg: string
  data: T
}

// 用户搜索参数
export interface UserSearchParams extends PageParams {
  keyword?: string
  status?: number
  loginType?: string
  school?: string
  major?: string
  startDate?: string
  endDate?: string
}