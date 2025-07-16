<template>
  <view class="login-test">
    <text>登录页面测试</text>
    <button @click="goBack">返回</button>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'

const goBack = () => {
  Taro.navigateBack()
}
</script>

<style lang="scss" scoped>
.login-test {
  padding: 40rpx;
  text-align: center;
  
  text {
    font-size: 32rpx;
    margin-bottom: 40rpx;
    display: block;
  }
  
  button {
    padding: 20rpx 40rpx;
    background: #ff4757;
    color: white;
    border: none;
    border-radius: 8rpx;
  }
}
</style>