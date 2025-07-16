/**
 * 轮播图API接口
 */
import request, { ApiResponse } from '../utils/request'

// 轮播图数据类型定义
export interface CarouselItem {
  id: number
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  platformType: string
  clickCount: number
  sortOrder: number
  isActive: boolean
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

// 轮播图API类
class CarouselApi {
  /**
   * 查询有效轮播图
   * @param platform 平台类型 (all-全部,web-网站,app-APP,mini-小程序)
   * @param limit 限制数量
   */
  async queryActiveCarousel(platform: string = 'all', limit: number = 5): Promise<ApiResponse<CarouselItem[]>> {
    const response = await request.get<CarouselItem[]>('/carousel/queryActiveCarousel', {
      platform,
      limit
    })
    console.log('轮播图原始响应:', response)
    return response
  }

  /**
   * 增加轮播图点击量
   * @param id 轮播图ID
   */
  async incrementClickCount(id: number): Promise<ApiResponse<any>> {
    return request.post('/carousel/click', { id })
  }
}

// 创建轮播图API实例
const carouselApi = new CarouselApi()

export default carouselApi