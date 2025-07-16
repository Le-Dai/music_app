<template>
  <view class="profile-page">
    <!-- 未登录状态 -->
    <view v-if="!isLoggedIn" class="login-section">
      <!-- 顶部装饰 -->
      <view class="login-header">
        <view class="header-decoration">
          <view class="circle circle-1"></view>
          <view class="circle circle-2"></view>
          <view class="circle circle-3"></view>
        </view>
        <view class="welcome-text">
          <text class="welcome-title">欢迎使用</text>
          <text class="app-name">学习助手</text>
          <text class="login-tip">登录后享受更多专属服务</text>
        </view>
      </view>
      
      <!-- 登录方式 -->
      <view class="login-container">
        <view class="login-title">
          <text class="title-text">手机号登录</text>
          <text class="title-desc">输入手机号获取验证码完成登录</text>
        </view>
        
        <!-- 手机号与验证码输入 -->
        <view class="input-section">
          <!-- 手机号输入 -->
          <view class="input-group">
            <text class="input-label">手机号</text>
            <view class="phone-input-group">
              <input 
                class="input-field phone-input"
                type="number"
                placeholder="请输入11位手机号"
                v-model="phoneNumber"
                maxlength="11"
              />
            </view>
          </view>
          
          <!-- 验证码输入 -->
          <view class="input-group">
            <text class="input-label">验证码</text>
            <view class="code-input-group">
              <input 
                class="input-field code-input"
                type="number"
                placeholder="请输入验证码"
                v-model="verifyCode"
                maxlength="6"
              />
              <button 
                class="send-code-btn"
                @tap="sendVerifyCode"
                :disabled="!canSendCode"
                :class="{ 'disabled': !canSendCode }"
              >
                {{ codeButtonText }}
              </button>
            </view>
          </view>
        </view>
        
        <!-- 登录按钮 -->
        <button 
          class="login-btn"
          @tap="handleManualLogin"
          :disabled="!canManualLogin"
          :class="{ 'disabled': !canManualLogin }"
        >
          <text class="btn-text">登录</text>
        </button>
      </view>
    </view>

    <!-- 已登录状态 -->
    <view v-else class="user-section">
      <!-- 用户信息卡片 -->
      <view class="user-card">
        <view class="user-header">
          <view class="avatar-wrapper">
            <image 
              class="user-avatar" 
              :src="userInfo.avatar || 'https://via.placeholder.com/120x120/ff4757/ffffff?text=U'" 
              mode="aspectFill" 
            />
            <view class="avatar-badge">VIP</view>
          </view>
          <view class="user-info">
            <text class="user-name">{{ userInfo.nickname || '用户' }}</text>
            <text class="user-phone" v-if="userInfo.phone">{{ formatPhone(userInfo.phone) }}</text>
            <text class="user-level">学习达人 LV.3</text>
          </view>
          <button class="logout-btn" @tap="handleLogout">
            <text>退出</text>
          </button>
        </view>
      </view>
      
      <!-- 数据统计卡片 -->
      <view class="stats-card">
        <view class="card-title">
          <text class="title-text">学习数据</text>
          <text class="title-desc">记录你的每一次进步</text>
        </view>
        <view class="stats-grid">
          <view class="stats-item">
            <view class="stats-icon">📅</view>
            <text class="stats-number">{{ userStats.studyDays }}</text>
            <text class="stats-label">学习天数</text>
          </view>
          <view class="stats-item">
            <view class="stats-icon">✏️</view>
            <text class="stats-number">{{ userStats.practiceCount }}</text>
            <text class="stats-label">练习次数</text>
          </view>
          <view class="stats-item">
            <view class="stats-icon">🎯</view>
            <text class="stats-number">{{ userStats.correctRate }}%</text>
            <text class="stats-label">正确率</text>
          </view>
        </view>
      </view>
      
      <!-- 功能菜单卡片 -->
      <view class="menu-card">
        <view class="menu-grid">
          <view class="menu-item" @tap="goToStudyHistory">
            <view class="menu-icon-wrapper">
              <text class="menu-icon">📚</text>
            </view>
            <text class="menu-text">学习记录</text>
          </view>
          <view class="menu-item" @tap="goToSettings">
            <view class="menu-icon-wrapper">
              <text class="menu-icon">⚙️</text>
            </view>
            <text class="menu-text">设置</text>
          </view>
          <view class="menu-item" @tap="goToAbout">
            <view class="menu-icon-wrapper">
              <text class="menu-icon">ℹ️</text>
            </view>
            <text class="menu-text">关于我们</text>
          </view>
          <view class="menu-item" @tap="goToFeedback">
            <view class="menu-icon-wrapper">
              <text class="menu-icon">💬</text>
            </view>
            <text class="menu-text">意见反馈</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'
import request from '../../utils/request'

// 登录状态
const isLoggedIn = ref(false)
const userInfo = ref({
  nickname: '',
  avatar: '',
  phone: ''
})

// 手机号登录相关
const phoneNumber = ref('')
const verifyCode = ref('')
const countdown = ref(0)
const timer = ref(null)

// 用户统计数据
const userStats = ref({
  studyDays: 0,
  practiceCount: 0,
  correctRate: 0
})

// 计算属性
const canSendCode = computed(() => {
  return phoneNumber.value.length === 11 && countdown.value === 0
})

const canManualLogin = computed(() => {
  return phoneNumber.value.length === 11 && verifyCode.value.length === 6
})

const codeButtonText = computed(() => {
  return countdown.value > 0 ? `${countdown.value}s` : '发送验证码'
})

// 微信用户授权登录
const handleWechatLogin = async (e) => {
  console.log('微信用户信息:', e.detail)
  
  if (e.detail.userInfo) {
    try {
      // 获取用户信息
      userInfo.value = {
        nickname: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl,
        phone: ''
      }
      
      // 这里应该调用后端API保存用户信息
      // await userApi.wechatLogin(e.detail)
      
      isLoggedIn.value = true
      loadUserStats()
      
      Taro.showToast({
        title: '登录成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('微信登录失败:', error)
      Taro.showToast({
        title: '登录失败',
        icon: 'none'
      })
    }
  }
}

// 手机号快速登录
const handlePhoneLogin = async (e) => {
  console.log('手机号信息:', e.detail)
  
  if (e.detail.encryptedData) {
    try {
      // 这里应该调用后端API解密手机号
      // const result = await userApi.phoneLogin(e.detail)
      
      // 模拟登录成功
      userInfo.value = {
        nickname: '手机用户',
        avatar: '',
        phone: '138****1234' // 这里应该是解密后的真实手机号
      }
      
      isLoggedIn.value = true
      loadUserStats()
      
      Taro.showToast({
        title: '登录成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('手机号登录失败:', error)
      Taro.showToast({
        title: '登录失败',
        icon: 'none'
      })
    }
  }
}

// 发送验证码
const sendVerifyCode = async () => {
  if (!canSendCode.value) return
  
  try {
    // 调用后端API发送验证码
    const response = await fetch(`http://localhost:8080/send/${phoneNumber.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (response.ok) {
      Taro.showToast({
        title: '验证码已发送',
        icon: 'success'
      })
      
      // 开始倒计时
      countdown.value = 60
      timer.value = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer.value)
          timer.value = null
        }
      }, 1000)
    } else {
      throw new Error('发送验证码失败')
    }
    
  } catch (error) {
    console.error('发送验证码失败:', error)
    Taro.showToast({
      title: '发送失败',
      icon: 'none'
    })
  }
}

// 验证码登录
const handleManualLogin = async () => {
  if (!canManualLogin.value) return
  
  try {
    // 调用后端API验证登录
    const response = await fetch('http://localhost:8080/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phoneNumber.value,
        code: verifyCode.value
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('登录接口返回:', result)
      
      // 保存token到本地缓存 - token在data字段中
      if (result.data && result.code === 200) {
        Taro.setStorageSync('access_token', result.data)
        console.log('保存token:', result.data)
      }
      
      // 获取用户详细信息
      await fetchUserInfo()
      
      isLoggedIn.value = true
      loadUserStats()
      
      Taro.showToast({
        title: '登录成功',
        icon: 'success'
      })
      
      // 清空输入
      phoneNumber.value = ''
      verifyCode.value = ''
    } else {
      const errorResult = await response.json()
      throw new Error(errorResult.message || '登录失败')
    }
    
  } catch (error) {
    console.error('验证码登录失败:', error)
    Taro.showToast({
      title: error.message || '验证码错误',
      icon: 'none'
    })
  }
}

// 退出登录
const handleLogout = () => {
  Taro.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        isLoggedIn.value = false
        userInfo.value = {
          nickname: '',
          avatar: '',
          phone: ''
        }
        userStats.value = {
          studyDays: 0,
          practiceCount: 0,
          correctRate: 0
        }
        
        Taro.showToast({
          title: '已退出登录',
          icon: 'success'
        })
      }
    }
  })
}

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    console.log('开始获取用户信息，当前token:', Taro.getStorageSync('access_token'))
    const response = await request.get('/users/userInfo')
    console.log('获取用户信息响应:', response)
    if (response.data) {
      userInfo.value = {
        nickname: response.data.username || '用户',
        avatar: response.data.avatarUrl || '',
        phone: response.data.phone || ''
      }
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    // 如果获取失败，使用默认信息
    userInfo.value = {
      nickname: '用户',
      avatar: '',
      phone: phoneNumber.value || ''
    }
  }
}

// 加载用户统计数据
const loadUserStats = async () => {
  try {
    // 这里应该调用后端API获取用户统计
    // const stats = await userApi.getUserStats()
    
    // 模拟数据
    userStats.value = {
      studyDays: 15,
      practiceCount: 48,
      correctRate: 85
    }
  } catch (error) {
    console.error('加载用户统计失败:', error)
  }
}

// 格式化手机号
const formatPhone = (phone: string) => {
  if (phone.length === 11) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
  return phone
}

// 页面跳转
const goToStudyHistory = () => {
  Taro.navigateTo({
    url: '/pages/study-history/index'
  })
}

const goToSettings = () => {
  Taro.navigateTo({
    url: '/pages/settings/index'
  })
}

const goToAbout = () => {
  Taro.navigateTo({
    url: '/pages/about/index'
  })
}

const goToFeedback = () => {
  Taro.navigateTo({
    url: '/pages/feedback/index'
  })
}

// 页面加载时检查登录状态
Taro.useDidShow(async () => {
  // 检查本地存储的登录状态
  const token = Taro.getStorageSync('access_token')
  if (token) {
    try {
      // 尝试获取用户信息验证token有效性
      await fetchUserInfo()
      isLoggedIn.value = true
      loadUserStats()
    } catch (error) {
      // token无效，清除本地存储
      Taro.removeStorageSync('access_token')
      isLoggedIn.value = false
    }
  }
})
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 120rpx;
}

/* 登录部分样式 */
.login-section {
  padding: 0;
}

.login-header {
  position: relative;
  padding: 100rpx 40rpx 60rpx;
  text-align: center;
  overflow: hidden;
  
  .header-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    
    .circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      
      &.circle-1 {
        width: 200rpx;
        height: 200rpx;
        top: -100rpx;
        right: -100rpx;
        animation: float 6s ease-in-out infinite;
      }
      
      &.circle-2 {
        width: 150rpx;
        height: 150rpx;
        top: 200rpx;
        left: -75rpx;
        animation: float 8s ease-in-out infinite reverse;
      }
      
      &.circle-3 {
        width: 100rpx;
        height: 100rpx;
        bottom: 100rpx;
        right: 50rpx;
        animation: float 10s ease-in-out infinite;
      }
    }
  }
  
  .welcome-text {
    position: relative;
    z-index: 1;
    
    .welcome-title {
      display: block;
      font-size: 32rpx;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 10rpx;
    }
    
    .app-name {
      display: block;
      font-size: 56rpx;
      font-weight: bold;
      color: white;
      margin-bottom: 20rpx;
    }
    
    .login-tip {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

.login-container {
  padding: 50rpx 40rpx;
  background: white;
  border-radius: 40rpx 40rpx 0 0;
  box-shadow: 0 -10rpx 30rpx rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 60rpx;
  
  .title-text {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 12rpx;
  }
  
  .title-desc {
    font-size: 26rpx;
    color: #999;
    line-height: 1.4;
  }
}

.input-section {
  margin-bottom: 50rpx;
  
  .input-group {
    margin-bottom: 40rpx;
    
    .input-label {
      display: block;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 16rpx;
      font-weight: 500;
    }
    
    .input-field {
      width: 100%;
      height: 96rpx;
      padding: 0 24rpx;
      border: 2rpx solid #e5e7eb;
      border-radius: 16rpx;
      font-size: 32rpx;
      color: #333;
      background: #fafbfc;
      transition: all 0.3s ease;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 2rpx;
      
      &:focus {
        border-color: #667eea;
        background: white;
        box-shadow: 0 0 0 6rpx rgba(102, 126, 234, 0.1);
        outline: none;
      }
      
      &::placeholder {
        color: #9ca3af;
        font-size: 28rpx;
        text-align: center;
        letter-spacing: normal;
      }
      
      // 手机号输入框特殊样式
      &[type="number"] {
        font-family: 'Helvetica Neue', 'Arial', sans-serif;
        font-weight: 500;
        letter-spacing: 4rpx;
      }
    }
    
    .phone-input-group {
      display: flex;
      gap: 20rpx;
      align-items: center;
      
      .phone-input {
        flex: 1;
      }
    }
    
    .code-input-group {
      display: flex;
      gap: 20rpx;
      align-items: center;
      
      .code-input {
        flex: 1;
        min-width: 0;
        font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
        font-weight: bold;
        letter-spacing: 8rpx;
        text-align: center;
        font-size: 36rpx;
        
        &::placeholder {
          font-family: inherit;
          font-weight: normal;
          letter-spacing: normal;
          font-size: 28rpx;
        }
      }
      
      .send-code-btn {
        flex: 0 0 180rpx;
        height: 96rpx;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 16rpx;
        font-size: 26rpx;
        font-weight: 500;
        white-space: nowrap;
        transition: all 0.3s ease;
        
        &.disabled {
          background: #d1d5db;
          color: #9ca3af;
        }
        
        &:not(.disabled):active {
          transform: scale(0.96);
          box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
        }
      }
    }
  }
}

.login-btn {
  width: 100%;
  height: 100rpx;
  background: linear-gradient(135deg, #1e88e5, #1976d2);
  color: white;
  border: none;
  border-radius: 16rpx;
  font-size: 34rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 8rpx 24rpx rgba(30, 136, 229, 0.3);
  
  &.disabled {
    background: #d1d5db;
    color: #9ca3af;
    box-shadow: none;
  }
  
  &:not(.disabled):active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 16rpx rgba(30, 136, 229, 0.4);
  }
  
  .btn-text {
    font-size: 34rpx;
    font-weight: 600;
  }
}

/* 已登录状态样式 */
.user-section {
  padding: 20rpx;
}

.user-card {
  background: white;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  
  .user-header {
    padding: 40rpx;
    display: flex;
    align-items: center;
    
    .avatar-wrapper {
      position: relative;
      margin-right: 30rpx;
      
      .user-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        border: 4rpx solid #f0f0f0;
      }
      
      .avatar-badge {
        position: absolute;
        bottom: 0;
        right: 0;
        background: linear-gradient(135deg, #ffa502, #ff6348);
        color: white;
        font-size: 20rpx;
        padding: 4rpx 12rpx;
        border-radius: 12rpx;
        font-weight: bold;
      }
    }
    
    .user-info {
      flex: 1;
      
      .user-name {
        display: block;
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
      }
      
      .user-phone {
        display: block;
        font-size: 26rpx;
        color: #999;
        margin-bottom: 8rpx;
      }
      
      .user-level {
        font-size: 24rpx;
        color: #667eea;
        background: #f0f3ff;
        padding: 4rpx 12rpx;
        border-radius: 12rpx;
        display: inline-block;
      }
    }
    
    .logout-btn {
      padding: 8rpx 18rpx;
      background: #f8f8f8;
      border: none;
      border-radius: 14rpx;
      font-size: 22rpx;
      color: #666;
      width: 80rpx;
      height: 56rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.stats-card {
  background: white;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  
  .card-title {
    margin-bottom: 30rpx;
    
    .title-text {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      display: block;
      margin-bottom: 8rpx;
    }
    
    .title-desc {
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .stats-grid {
    display: flex;
    justify-content: space-around;
    
    .stats-item {
      text-align: center;
      flex: 1;
      
      .stats-icon {
        font-size: 40rpx;
        margin-bottom: 16rpx;
      }
      
      .stats-number {
        display: block;
        font-size: 44rpx;
        font-weight: bold;
        color: #667eea;
        margin-bottom: 8rpx;
      }
      
      .stats-label {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

.menu-card {
  background: white;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  
  .menu-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30rpx;
    
    .menu-item {
      text-align: center;
      padding: 40rpx 20rpx;
      background: #f8f9ff;
      border-radius: 16rpx;
      transition: all 0.3s ease;
      
      &:active {
        background: #e8ecff;
        transform: scale(0.95);
      }
      
      .menu-icon-wrapper {
        width: 80rpx;
        height: 80rpx;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20rpx;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
        
        .menu-icon {
          font-size: 36rpx;
        }
      }
      
      .menu-text {
        font-size: 26rpx;
        color: #333;
        font-weight: 500;
      }
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>