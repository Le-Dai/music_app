<template>
  <view class="login-simple">
    <view class="header">
      <text class="title">登录页面</text>
    </view>
    
    <view class="content">
      <text>这是一个简化的登录页面</text>
      <button @click="goHome">返回首页</button>
      <button @click="goStudy">学习页面</button>
      <button @click="goProfile">我的页面</button>
      <button @click="goApi">API测试</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'

const goHome = () => {
  Taro.navigateTo({
    url: '/pages/study/index'
  })
}

const goStudy = () => {
  Taro.navigateTo({
    url: '/pages/study/index'
  })
}

const goProfile = () => {
  Taro.navigateTo({
    url: '/pages/profile/index'
  })
}

const goApi = () => {
  Taro.navigateTo({
    url: '/pages/api-test/index'
  })
}
</script>

<style lang="scss" scoped>
.login-simple {
  padding: 40rpx;
  min-height: 100vh;
  background: #f5f5f5;
  
  .header {
    text-align: center;
    margin-bottom: 60rpx;
    
    .title {
      font-size: 48rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .content {
    text-align: center;
    
    text {
      display: block;
      margin-bottom: 40rpx;
      font-size: 32rpx;
      color: #666;
    }
    
    button {
      display: block;
      width: 300rpx;
      margin: 20rpx auto;
      padding: 20rpx 60rpx;
      background: #ff4757;
      color: white;
      border: none;
      border-radius: 8rpx;
      font-size: 28rpx;
    }
  }
}
</style>