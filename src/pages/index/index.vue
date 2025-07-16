<template>
  <view class="index-page">
    <!-- 轮播图组件 -->
    <view class="carousel-section">
      <Carousel 
        platform="app" 
        :limit="5" 
        height="280rpx"
        ref="carousel"
      />
    </view>
    
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import Carousel from '../../components/Carousel/index.vue'

export default {
  name: 'IndexPage',
  components: {
    Carousel
  },
  data() {
    return {}
  },
  mounted() {
    console.log('首页组件已挂载')
  },
  methods: {
    refreshCarousel() {
      if (this.$refs.carousel) {
        this.$refs.carousel.refresh()
      }
    }
  }
}
</script>

<style>
.index-page {
  background-color: #f8f8f8;
  min-height: 100vh;
  padding-bottom: 120rpx; /* 为底部tabBar预留空间 */
}

.carousel-section {
  margin-bottom: 20rpx;
}
</style>