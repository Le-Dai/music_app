/**
 * 用户相关API接口 (根据后端Swagger更新)
 */
import request from '../utils/request'
import type {
  User,
  UserLoginLog,
  PageParams,
  ResponseUtils
} from '../types/user'

class UserApi {
  
  // ==================== 用户管理接口 ====================
  
  /**
   * 新增用户
   */
  insertUser(data: User) {
    return request.post<ResponseUtils>('/users/insert', data)
  }

  /**
   * 保存用户
   */
  saveUser(data: User) {
    return request.post<ResponseUtils>('/users/save', data)
  }

  /**
   * 根据ID更新用户
   */
  updateUserById(data: User) {
    return request.post<ResponseUtils>('/users/updateById', data)
  }

  /**
   * 根据ID删除用户
   */
  deleteUserById(ids: number[]) {
    return request.post<ResponseUtils>('/users/deleteById', ids)
  }

  /**
   * 根据ID查询用户
   */
  getUserById(id: number) {
    return request.get<ResponseUtils<User>>('/users/getById', { id })
  }

  /**
   * 查询用户列表
   */
  getUserList(params: User) {
    return request.post<ResponseUtils<User[]>>('/users/list', params)
  }

  /**
   * 分页查询用户
   */
  getUserPage(params: PageParams<User>) {
    return request.post<ResponseUtils>('/users/page', params)
  }

  /**
   * 获取用户数量
   */
  getUserCount(params: User) {
    return request.post<ResponseUtils<number>>('/users/count', params)
  }

  // ==================== 用户登录日志接口 ====================
  
  /**
   * 新增登录日志
   */
  insertLoginLog(data: UserLoginLog) {
    return request.post<ResponseUtils>('/userLoginLogs/insert', data)
  }

  /**
   * 保存登录日志
   */
  saveLoginLog(data: UserLoginLog) {
    return request.post<ResponseUtils>('/userLoginLogs/save', data)
  }

  /**
   * 根据ID更新登录日志
   */
  updateLoginLogById(data: UserLoginLog) {
    return request.post<ResponseUtils>('/userLoginLogs/updateById', data)
  }

  /**
   * 根据ID删除登录日志
   */
  deleteLoginLogById(ids: number[]) {
    return request.post<ResponseUtils>('/userLoginLogs/deleteById', ids)
  }

  /**
   * 根据ID查询登录日志
   */
  getLoginLogById(id: number) {
    return request.get<ResponseUtils<UserLoginLog>>('/userLoginLogs/getById', { id })
  }

  /**
   * 查询登录日志列表
   */
  getLoginLogList(params: UserLoginLog) {
    return request.post<ResponseUtils<UserLoginLog[]>>('/userLoginLogs/list', params)
  }

  /**
   * 分页查询登录日志
   */
  getLoginLogPage(params: PageParams<UserLoginLog>) {
    return request.post<ResponseUtils>('/userLoginLogs/page', params)
  }

  /**
   * 获取登录日志数量
   */
  getLoginLogCount(params: UserLoginLog) {
    return request.post<ResponseUtils<number>>('/userLoginLogs/count', params)
  }

  // ==================== 扩展功能接口 ====================
  
  /**
   * 简单登录验证 (基于用户名密码)
   */
  simpleLogin(username: string, password: string) {
    return this.getUserList({ 
      username, 
      password,
      status: 1 // 只查询正常状态用户
    })
  }

  /**
   * 用户注册
   */
  registerUser(userData: User) {
    return this.insertUser({
      ...userData,
      status: 1, // 默认正常状态
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  /**
   * 记录登录日志
   */
  recordLogin(userId: number, loginType: string, success: boolean, ip?: string, userAgent?: string) {
    return this.insertLoginLog({
      userId,
      loginType,
      loginStatus: success ? 1 : 0,
      loginTime: new Date().toISOString(),
      loginIp: ip,
      userAgent,
      remark: success ? '登录成功' : '登录失败'
    })
  }
}

// 创建API实例
const userApi = new UserApi()

export default userApi
export { UserApi }