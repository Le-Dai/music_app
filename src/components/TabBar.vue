<template>
  <view class="tabbar">
    <view 
      class="tabbar-item" 
      v-for="(item, index) in tabList" 
      :key="index"
      @click="switchTab(item, index)"
    >
      <view class="item-icon" :class="{ active: currentIndex === index }">
        <!-- 学习图标 -->
        <view v-if="item.text === '学习'" class="css-icon study-icon">
          <view class="book"></view>
        </view>
        <!-- 练习图标 -->
        <view v-else-if="item.text === '练习'" class="css-icon practice-icon">
          <view class="pen"></view>
        </view>
        <!-- 测试图标 -->
        <view v-else-if="item.text === '测试'" class="css-icon test-icon">
          <view class="paper"></view>
        </view>
        <!-- 我的图标 -->
        <view v-else-if="item.text === '我的'" class="css-icon profile-icon">
          <view class="user"></view>
        </view>
      </view>
      <text class="item-text" :class="{ active: currentIndex === index }">
        {{ item.text }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'

interface TabItem {
  pagePath: string
  text: string
}

const tabList: TabItem[] = [
  {
    pagePath: 'pages/study/index',
    text: '学习'
  },
  {
    pagePath: 'pages/practice/index',
    text: '练习'
  },
  {
    pagePath: 'pages/test/index',
    text: '测试'
  },
  {
    pagePath: 'pages/profile/index',
    text: '我的'
  }
]

const currentIndex = ref(0)

const switchTab = (item: TabItem, index: number) => {
  if (currentIndex.value === index) return
  
  currentIndex.value = index
  
  Taro.switchTab({
    url: `/${item.pagePath}`
  }).catch(() => {
    Taro.redirectTo({
      url: `/${item.pagePath}`
    })
  })
}

onMounted(() => {
  try {
    const pages = Taro.getCurrentPages()
    if (pages && pages.length > 0) {
      const currentPage = pages[pages.length - 1]
      const currentRoute = currentPage.route
      
      const activeIndex = tabList.findIndex(item => item.pagePath === currentRoute)
      if (activeIndex !== -1) {
        currentIndex.value = activeIndex
      }
    }
  } catch (error) {
    console.log('获取当前页面失败', error)
  }
})
</script>

<style lang="scss" scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #ffffff;
  border-top: 2rpx solid #e5e5e5;
  display: flex;
  align-items: center;
  z-index: 999;
  
  .tabbar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    
    .item-icon {
      margin-bottom: 8rpx;
      transition: transform 0.2s ease;
      
      &.active {
        transform: scale(1.1);
      }
      
      .css-icon {
        width: 44rpx;
        height: 44rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        // 学习图标 - 书本
        &.study-icon .book {
          width: 32rpx;
          height: 24rpx;
          border: 3rpx solid #666666;
          border-radius: 2rpx;
          position: relative;
          
          &::before {
            content: '';
            position: absolute;
            top: 6rpx;
            left: 4rpx;
            right: 4rpx;
            height: 2rpx;
            background: #666666;
            box-shadow: 0 6rpx 0 #666666, 0 12rpx 0 #666666;
          }
        }
        
        // 练习图标 - 笔
        &.practice-icon .pen {
          width: 4rpx;
          height: 32rpx;
          background: #666666;
          transform: rotate(45deg);
          border-radius: 2rpx 2rpx 0 0;
          position: relative;
          
          &::before {
            content: '';
            position: absolute;
            top: -8rpx;
            left: -2rpx;
            width: 8rpx;
            height: 8rpx;
            background: #666666;
            transform: rotate(45deg);
          }
        }
        
        // 测试图标 - 文件
        &.test-icon .paper {
          width: 28rpx;
          height: 36rpx;
          border: 3rpx solid #666666;
          border-radius: 2rpx;
          position: relative;
          
          &::before {
            content: '';
            position: absolute;
            top: 6rpx;
            left: 4rpx;
            right: 4rpx;
            height: 2rpx;
            background: #666666;
            box-shadow: 0 6rpx 0 #666666, 0 12rpx 0 #666666;
          }
          
          &::after {
            content: '';
            position: absolute;
            top: -3rpx;
            right: -3rpx;
            width: 0;
            height: 0;
            border-left: 12rpx solid #ffffff;
            border-top: 12rpx solid #666666;
          }
        }
        
        // 我的图标 - 用户
        &.profile-icon .user {
          width: 32rpx;
          height: 32rpx;
          position: relative;
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 12rpx;
            height: 12rpx;
            background: #666666;
            border-radius: 50%;
          }
          
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 24rpx;
            height: 16rpx;
            background: #666666;
            border-radius: 12rpx 12rpx 0 0;
          }
        }
      }
    }
    
    .item-text {
      font-size: 20rpx;
      color: #666666;
      line-height: 1;
      transition: color 0.2s ease;
      
      &.active {
        color: #ff4757;
        font-weight: 600;
      }
    }
    
    // 激活状态下改变图标颜色
    &:nth-child(1) .item-icon.active .study-icon .book {
      border-color: #ff4757;
      &::before { background: #ff4757; }
    }
    
    &:nth-child(2) .item-icon.active .practice-icon .pen {
      background: #ff4757;
      &::before { background: #ff4757; }
    }
    
    &:nth-child(3) .item-icon.active .test-icon .paper {
      border-color: #ff4757;
      &::before { background: #ff4757; }
      &::after { border-top-color: #ff4757; }
    }
    
    &:nth-child(4) .item-icon.active .profile-icon .user {
      &::before, &::after { background: #ff4757; }
    }
  }
}
</style>