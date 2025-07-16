/**
 * HTTP请求工具类
 * 基于Taro.request封装，支持拦截器、错误处理等
 */
import Taro from '@tarojs/taro'

// API基础配置
const API_CONFIG = {
  baseURL: 'http://localhost:8080',
  //baseURL: 'http://192.168.11.239:8080',
  timeout: 10000,
  header: {
    'Content-Type': 'application/json'
  }
}

// 请求接口类型定义
interface RequestOptions {
  url: string
  method?: keyof Taro.request.Method
  data?: any
  header?: Record<string, string>
  timeout?: number
}

interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
  timestamp?: number
}

class RequestManager {
  private baseURL: string
  private defaultHeader: Record<string, string>
  private timeout: number

  constructor() {
    this.baseURL = API_CONFIG.baseURL
    this.defaultHeader = API_CONFIG.header
    this.timeout = API_CONFIG.timeout
  }

  /**
   * 设置Token
   */
  setToken(token: string) {
    this.defaultHeader['Authorization'] = `Bearer ${token}`
    // 同时存储到本地存储
    Taro.setStorageSync('access_token', token)
  }

  /**
   * 获取Token
   */
  getToken(): string {
    return this.defaultHeader['Authorization'] || Taro.getStorageSync('access_token') || ''
  }

  /**
   * 清除Token
   */
  clearToken() {
    delete this.defaultHeader['Authorization']
    Taro.removeStorageSync('access_token')
  }

  /**
   * 请求拦截器
   */
  private requestInterceptor(options: RequestOptions): RequestOptions {
    // 添加baseURL
    if (!options.url.startsWith('http')) {
      options.url = this.baseURL + options.url
    }

    // 合并请求头
    options.header = {
      ...this.defaultHeader,
      ...options.header
    }

    // 添加Token
    const token = Taro.getStorageSync('access_token')
    if (token && !options.header['token']) {
      options.header['token'] = token
    }

    // 添加请求时间戳（防止缓存）
    if (options.method === 'GET') {
      const separator = options.url.includes('?') ? '&' : '?'
      options.url += `${separator}_t=${Date.now()}`
    }

    console.log('API请求:', options)
    return options
  }

  /**
   * 响应拦截器
   */
  private responseInterceptor<T>(response: any): Promise<ApiResponse<T>> {
    console.log('API响应:', response)

    const { statusCode, data } = response

    // HTTP状态码检查
    if (statusCode !== 200) {
      return Promise.reject({
        code: statusCode,
        message: `HTTP错误: ${statusCode}`,
        success: false
      })
    }

    // 业务状态码检查
    if (data.code !== undefined && data.code !== 200 && data.code !== 0) {
      // 处理特殊错误码
      if (data.code === 401) {
        this.handleUnauthorized()
      }
      
      return Promise.reject({
        code: data.code,
        message: data.message || '请求失败',
        success: false
      })
    }

    return Promise.resolve(data)
  }

  /**
   * 处理401未授权
   */
  private handleUnauthorized() {
    this.clearToken()
    Taro.showToast({
      title: '登录已过期，请重新登录',
      icon: 'none'
    })
    
    // 跳转到登录页
    setTimeout(() => {
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    }, 1500)
  }

  /**
   * 错误处理
   */
  private handleError(error: any, showToast: boolean = true): Promise<never> {
    console.error('API请求错误:', error)

    let message = '网络错误，请检查网络连接'
    
    if (error.code) {
      switch (error.code) {
        case -1:
          message = '网络连接失败'
          break
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请先登录'
          break
        case 403:
          message = '权限不足'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = error.message || '请求失败'
      }
    }

    if (showToast) {
      Taro.showToast({
        title: message,
        icon: 'none'
      })
    }

    return Promise.reject(error)
  }

  /**
   * 通用请求方法
   */
  async request<T = any>(options: RequestOptions & { silent?: boolean }): Promise<ApiResponse<T>> {
    try {
      // 请求拦截
      const requestOptions = this.requestInterceptor(options)
      
      // 发送请求
      const response = await Taro.request({
        ...requestOptions,
        timeout: options.timeout || this.timeout
      })
      
      // 响应拦截
      return await this.responseInterceptor<T>(response)
    } catch (error) {
      return this.handleError(error, !options.silent)
    }
  }

  /**
   * GET请求
   */
  get<T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      data,
      ...options
    })
  }

  /**
   * POST请求
   */
  post<T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...options
    })
  }

  /**
   * PUT请求
   */
  put<T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }

  /**
   * DELETE请求
   */
  delete<T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      data,
      ...options
    })
  }

  /**
   * 文件上传
   */
  upload<T = any>(url: string, filePath: string, name: string = 'file', formData?: Record<string, any>): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      const token = Taro.getStorageSync('access_token')
      const uploadHeader = {
        ...this.defaultHeader,
        'Content-Type': 'multipart/form-data'
      }
      if (token) {
        uploadHeader['token'] = token
      }
      
      const uploadTask = Taro.uploadFile({
        url: this.baseURL + url,
        filePath,
        name,
        formData,
        header: uploadHeader,
        success: (res) => {
          try {
            const data = JSON.parse(res.data)
            resolve(data)
          } catch (error) {
            reject({ code: -1, message: '上传响应解析失败' })
          }
        },
        fail: (error) => {
          reject({ code: -1, message: '文件上传失败', error })
        }
      })

      // 可以返回uploadTask用于监听上传进度
      return uploadTask
    })
  }
}

// 创建请求实例
const request = new RequestManager()

export default request
export { ApiResponse, RequestOptions }