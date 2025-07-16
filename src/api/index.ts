/**
 * API统一导出文件
 */

import userApi from './user'
import carouselApi from './carousel'
import authApi from './auth'
import request from '../utils/request'

// 导出所有API
export {
  userApi,
  carouselApi,
  authApi,
  request
}

// 默认导出
export default {
  user: userApi,
  carousel: carouselApi,
  auth: authApi,
  request
}