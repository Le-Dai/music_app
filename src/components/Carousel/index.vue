<template>
  <view class="carousel-container">
    <!-- 加载状态 -->
    <view v-if="loading" class="carousel-loading">
      <text>加载中...</text>
    </view>
    
    <!-- 空状态 -->
    <view v-else-if="carouselList.length === 0" class="carousel-empty">
      <text>暂无轮播图</text>
    </view>
    
    <!-- 轮播图 -->
    <swiper
      v-else
      class="carousel-swiper"
      :indicator-dots="carouselList.length > 1"
      :autoplay="carouselList.length > 1"
      :interval="3000"
      :duration="500"
      :circular="carouselList.length > 1"
      indicator-color="rgba(255, 255, 255, 0.3)"
      indicator-active-color="#ff4757"
    >
      <swiper-item
        v-for="(item, index) in carouselList"
        :key="`carousel-${item.id}-${index}`"
        class="carousel-item"
        @tap="handleCarouselClick(item)"
      >
        <view class="carousel-image-wrapper">
          <img 
            :src="item.imageUrl || item.image_url || item.imgUrl || item.url"
            class="carousel-image"
            @error="handleImageError"
            @load="handleImageLoad"
          />
          <view class="carousel-overlay">
            <view class="carousel-title">{{ item.title || item.name || '轮播图' }}</view>
            <view class="carousel-description" v-if="item.description || item.desc">
              {{ item.description || item.desc }}
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import { carouselApi } from '../../api'

export default {
  name: 'Carousel',
  props: {
    platform: {
      type: String,
      default: 'all'
    },
    limit: {
      type: Number,
      default: 5
    },
    height: {
      type: String,
      default: '400rpx'
    }
  },
  data() {
    return {
      carouselList: [],
      loading: false
    }
  },
  mounted() {
    this.loadCarouselData()
  },
  methods: {
    async loadCarouselData() {
      try {
        this.loading = true
        const response = await carouselApi.queryActiveCarousel(this.platform, this.limit)
        console.log('轮播图API响应:', response)
        
        // 根据后端ResponseUtils结构解析数据
        let carouselData = []
        
        // 后端ResponseUtils返回: {code: 200, msg: "成功", data: [...]}
        if (response && (response.code === 200 || response.code === 0)) {
          carouselData = response.data || []
          console.log('从response.data获取数据:', carouselData)
          
          // 确保是数组
          if (!Array.isArray(carouselData)) {
            console.warn('数据不是数组格式:', carouselData)
            carouselData = []
          }
          
          this.carouselList = carouselData
          console.log('解析后的轮播图数据:', this.carouselList)
        } else {
          console.warn('轮播图API返回失败，响应码:', response?.code, '响应:', response)
        }
      } catch (error) {
        console.error('加载轮播图失败:', error)
        Taro.showToast({
          title: '加载轮播图失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    async handleCarouselClick(item) {
      try {
        // 增加点击量
        await carouselApi.incrementClickCount(item.id)
        
        // 处理跳转链接
        const linkUrl = item.linkUrl || item.link_url || item.url || item.href
        if (linkUrl) {
          if (linkUrl.startsWith('http')) {
            // 外部链接 - 复制到剪贴板
            Taro.setClipboardData({
              data: linkUrl,
              success: () => {
                Taro.showToast({
                  title: '链接已复制到剪贴板',
                  icon: 'none'
                })
              }
            })
          } else {
            // 内部页面跳转
            Taro.navigateTo({
              url: linkUrl
            })
          }
        }
      } catch (error) {
        console.error('处理轮播图点击失败:', error)
      }
    },
    
    handleImageError(e) {
      console.error('轮播图图片加载失败:', e)
      Taro.showToast({
        title: '图片加载失败',
        icon: 'none'
      })
    },
    
    handleImageLoad(e) {
      console.log('轮播图图片加载成功:', e)
    },
    
    refresh() {
      this.loadCarouselData()
    }
  }
}
</script>

<style scoped>
.carousel-container {
  width: 100%;
  position: relative;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.carousel-swiper {
  width: 100%;
  height: v-bind(height);
}

.carousel-item {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.carousel-item:active .carousel-image {
  transform: scale(1.05);
}

.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top, 
    rgba(0, 0, 0, 0.8) 0%, 
    rgba(0, 0, 0, 0.4) 50%, 
    transparent 100%
  );
  padding: 40rpx 30rpx 25rpx;
  color: white;
}

.carousel-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
  line-height: 1.3;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);
}

.carousel-description {
  font-size: 28rpx;
  opacity: 0.95;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.5);
}

.carousel-loading,
.carousel-empty {
  height: v-bind(height);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 28rpx;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.carousel-loading {
  position: relative;
}

.carousel-loading::after {
  content: '';
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #ddd;
  border-top: 4rpx solid #ff4757;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 20rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 自定义指示器样式 */
:deep(.uni-swiper-dots) {
  bottom: 20rpx;
}

:deep(.uni-swiper-dot) {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  margin: 0 8rpx;
  transition: all 0.3s ease;
}

:deep(.uni-swiper-dot-active) {
  width: 32rpx;
  border-radius: 8rpx;
}
</style>