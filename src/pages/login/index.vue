<template>
  <view class="login-page">
    <view class="header">
      <text class="title">🎵 音乐播放器</text>
      <text class="subtitle">请登录以继续使用</text>
    </view>

    <view class="login-form">
      <view class="form-item">
        <input 
          class="form-input"
          type="text"
          placeholder="请输入用户名"
          v-model="loginForm.username"
        />
      </view>
      
      <view class="form-item">
        <input 
          class="form-input"
          type="password"
          placeholder="请输入密码"
          v-model="loginForm.password"
        />
      </view>

      <view class="form-item">
        <button 
          class="login-btn"
          @tap="handleLogin"
          :disabled="!canLogin"
        >
          登录
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'

const loginForm = ref({
  username: '',
  password: ''
})

const canLogin = computed(() => {
  return loginForm.value.username && loginForm.value.password
})

const handleLogin = async () => {
  if (!canLogin.value) return

  Taro.showToast({
    title: '登录成功',
    icon: 'success'
  })
  
  setTimeout(() => {
    Taro.switchTab({
      url: '/pages/index/index'
    })
  }, 1000)
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ff4757, #ff6b7a);
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.header {
  text-align: center;
  margin-bottom: 80rpx;
  
  .title {
    font-size: 60rpx;
    font-weight: bold;
    color: white;
    display: block;
    margin-bottom: 20rpx;
  }
  
  .subtitle {
    font-size: 32rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.login-form {
  background: white;
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.1);
  
  .form-item {
    margin-bottom: 30rpx;
    
    .form-input {
      width: 100%;
      height: 88rpx;
      padding: 0 20rpx;
      border: 2rpx solid #eee;
      border-radius: 10rpx;
      font-size: 30rpx;
      color: #333;
      background: #f8f8f8;
      
      &:focus {
        border-color: #ff4757;
        background: white;
      }
    }
    
    .login-btn {
      width: 100%;
      height: 88rpx;
      background: #ff4757;
      color: white;
      border: none;
      border-radius: 10rpx;
      font-size: 32rpx;
      font-weight: bold;
      
      &:disabled {
        background: #ccc;
      }
    }
  }
}
</style>