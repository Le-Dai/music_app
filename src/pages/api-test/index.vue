<template>
  <view class="api-test-page">
    <view class="header">
      <text class="title">API测试页面</text>
    </view>

    <view class="test-section">
      <view class="section-title">后端连接测试</view>
      
      <view class="test-item">
        <view class="test-info">
          <text class="test-name">后端服务状态</text>
          <text class="test-desc">检查后端服务是否正常运行</text>
        </view>
        <view class="test-action">
          <button class="test-btn" @click="testBackendStatus" :disabled="testing">
            {{ testing ? '测试中...' : '测试' }}
          </button>
        </view>
      </view>

      <view class="test-item">
        <view class="test-info">
          <text class="test-name">获取用户信息</text>
          <text class="test-desc">测试用户API接口</text>
        </view>
        <view class="test-action">
          <button class="test-btn" @click="testUserApi" :disabled="testing">
            {{ testing ? '测试中...' : '测试' }}
          </button>
        </view>
      </view>

      <view class="test-item">
        <view class="test-info">
          <text class="test-name">查询用户列表</text>
          <text class="test-desc">测试用户列表查询接口</text>
        </view>
        <view class="test-action">
          <button class="test-btn" @click="testUserList" :disabled="testing">
            {{ testing ? '测试中...' : '测试' }}
          </button>
        </view>
      </view>

      <view class="test-item">
        <view class="test-info">
          <text class="test-name">发送验证码</text>
          <text class="test-desc">测试验证码发送功能</text>
        </view>
        <view class="test-action">
          <button class="test-btn" @click="testSendCode" :disabled="testing">
            {{ testing ? '测试中...' : '测试' }}
          </button>
        </view>
      </view>

      <view class="test-item">
        <view class="test-info">
          <text class="test-name">探测API端点</text>
          <text class="test-desc">尝试发现可用的API路径</text>
        </view>
        <view class="test-action">
          <button class="test-btn" @click="discoverEndpoints" :disabled="testing">
            {{ testing ? '测试中...' : '探测' }}
          </button>
        </view>
      </view>
    </view>

    <view class="result-section" v-if="testResults.length > 0">
      <view class="section-title">测试结果</view>
      <view class="result-list">
        <view 
          class="result-item" 
          v-for="(result, index) in testResults" 
          :key="index"
          :class="{ success: result.success, error: !result.success }"
        >
          <view class="result-header">
            <text class="result-title">{{ result.title }}</text>
            <text class="result-status">{{ result.success ? '✅' : '❌' }}</text>
          </view>
          <view class="result-content">
            <text class="result-message">{{ result.message }}</text>
            <view v-if="result.data" class="result-data">
              <text class="data-label">响应数据:</text>
              <text class="data-content">{{ JSON.stringify(result.data, null, 2) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="api-info">
      <view class="section-title">API配置信息</view>
      <view class="info-item">
        <text class="info-label">后端地址:</text>
        <text class="info-value">{{ apiBaseUrl }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">Swagger文档:</text>
        <text class="info-value">{{ swaggerUrl }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import userApi from '../../api/user'
import request from '../../utils/request'

// 状态
const testing = ref(false)
const testResults = ref<any[]>([])

// API配置信息
const apiBaseUrl = 'http://192.168.11.239:8080'
const swaggerUrl = 'http://192.168.11.239:8080/swagger-ui/index.html'

// 添加测试结果
const addTestResult = (title: string, success: boolean, message: string, data?: any) => {
  testResults.value.unshift({
    title,
    success,
    message,
    data,
    timestamp: new Date().toLocaleTimeString()
  })
}

// 测试后端服务状态
const testBackendStatus = async () => {
  if (testing.value) return
  
  testing.value = true
  
  try {
    // 尝试访问根路径，检查服务是否在运行
    const response = await request.get('/')
    
    addTestResult(
      '后端服务状态',
      true,
      '后端服务运行正常',
      response.data
    )
    
    Taro.showToast({
      title: '后端服务正常',
      icon: 'success'
    })
  } catch (error: any) {
    addTestResult(
      '后端服务状态',
      false,
      error.message || '连接失败',
      error
    )
    
    Taro.showToast({
      title: '连接失败',
      icon: 'error'
    })
  } finally {
    testing.value = false
  }
}

// 测试用户API
const testUserApi = async () => {
  if (testing.value) return
  
  testing.value = true
  
  try {
    // 测试根据ID获取用户信息
    const response = await userApi.getUserById(1)
    
    addTestResult(
      '用户API测试',
      response.code === 200,
      response.msg || '用户API调用成功',
      response.data
    )
    
    if (response.code === 200) {
      Taro.showToast({
        title: '用户API正常',
        icon: 'success'
      })
    } else {
      Taro.showToast({
        title: response.msg || 'API调用失败',
        icon: 'error'
      })
    }
  } catch (error: any) {
    addTestResult(
      '用户API测试',
      false,
      error.message || 'API调用失败',
      error
    )
    
    Taro.showToast({
      title: 'API调用失败',
      icon: 'error'
    })
  } finally {
    testing.value = false
  }
}

// 测试用户列表API
const testUserList = async () => {
  if (testing.value) return
  
  testing.value = true
  
  try {
    // 测试查询用户列表
    const response = await userApi.getUserList({})
    
    addTestResult(
      '用户列表测试',
      response.code === 200,
      response.msg || '用户列表查询成功',
      response.data
    )
    
    if (response.code === 200) {
      Taro.showToast({
        title: '用户列表API正常',
        icon: 'success'
      })
    } else {
      Taro.showToast({
        title: response.msg || 'API调用失败',
        icon: 'error'
      })
    }
  } catch (error: any) {
    addTestResult(
      '用户列表测试',
      false,
      error.message || 'API调用失败',
      error
    )
    
    Taro.showToast({
      title: 'API调用失败',
      icon: 'error'
    })
  } finally {
    testing.value = false
  }
}

// 测试发送验证码
const testSendCode = async () => {
  if (testing.value) return
  
  testing.value = true
  
  try {
    // 测试发送验证码（使用测试手机号）
    const response = await userApi.sendCode({
      type: 'phone',
      phone: '13800138000',
      scene: 'login'
    })
    
    addTestResult(
      '验证码发送测试',
      true,
      '验证码发送成功',
      response.data
    )
    
    Taro.showToast({
      title: '验证码发送成功',
      icon: 'success'
    })
  } catch (error: any) {
    addTestResult(
      '验证码发送测试',
      false,
      error.message || '发送失败',
      error
    )
    
    Taro.showToast({
      title: '发送失败',
      icon: 'error'
    })
  } finally {
    testing.value = false
  }
}

// 探测API端点
const discoverEndpoints = async () => {
  if (testing.value) return
  
  testing.value = true
  
  const commonEndpoints = [
    '/api',
    '/api/v1',
    '/health',
    '/api/health',
    '/actuator/health',
    '/api/user',
    '/api/auth',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/send-code',
    '/api/user/current',
    '/api/user/stats',
    '/swagger-ui.html',
    '/v3/api-docs',
    '/v2/api-docs',
    '/swagger-resources',
    '/swagger-resources/configuration/ui',
    '/swagger-resources/configuration/security'
  ]
  
  let foundEndpoints = []
  
  for (const endpoint of commonEndpoints) {
    try {
      const response = await request.get(endpoint, null, { silent: true })
      foundEndpoints.push({
        path: endpoint,
        status: 'success',
        data: response.data
      })
    } catch (error: any) {
      if (error.code && error.code !== 404) {
        foundEndpoints.push({
          path: endpoint,
          status: 'error',
          code: error.code,
          message: error.message
        })
      }
    }
  }
  
  addTestResult(
    'API端点探测',
    foundEndpoints.length > 0,
    `发现 ${foundEndpoints.length} 个可访问端点`,
    foundEndpoints
  )
  
  testing.value = false
}
</script>

<style lang="scss" scoped>
@use '../../styles/variables.scss' as vars;

.api-test-page {
  padding: vars.$spacing-base;
  min-height: 100vh;
  background-color: vars.$background-color;
}

.header {
  text-align: center;
  margin-bottom: vars.$spacing-lg;
  
  .title {
    font-size: vars.$font-size-xl;
    font-weight: bold;
    color: vars.$text-color;
  }
}

.section-title {
  font-size: vars.$font-size-lg;
  font-weight: bold;
  color: vars.$text-color;
  margin-bottom: vars.$spacing-base;
}

.test-section {
  margin-bottom: vars.$spacing-lg;
  
  .test-item {
    background: vars.$white;
    border-radius: vars.$border-radius-base;
    padding: vars.$spacing-base;
    margin-bottom: vars.$spacing-base;
    box-shadow: vars.$box-shadow-sm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .test-info {
      flex: 1;
      
      .test-name {
        font-size: vars.$font-size-base;
        color: vars.$text-color;
        font-weight: bold;
        display: block;
        margin-bottom: vars.$spacing-xs;
      }
      
      .test-desc {
        font-size: vars.$font-size-sm;
        color: vars.$text-light;
      }
    }
    
    .test-action {
      .test-btn {
        background: vars.$music-primary;
        color: vars.$white;
        border: none;
        border-radius: vars.$border-radius-sm;
        padding: vars.$spacing-sm vars.$spacing-base;
        font-size: vars.$font-size-sm;
        
        &:disabled {
          background: vars.$text-lighter;
        }
      }
    }
  }
}

.result-section {
  margin-bottom: vars.$spacing-lg;
  
  .result-list {
    max-height: 600rpx;
    overflow-y: auto;
    
    .result-item {
      background: vars.$white;
      border-radius: vars.$border-radius-base;
      margin-bottom: vars.$spacing-base;
      overflow: hidden;
      box-shadow: vars.$box-shadow-sm;
      
      &.success {
        border-left: 8rpx solid vars.$success-color;
      }
      
      &.error {
        border-left: 8rpx solid vars.$error-color;
      }
      
      .result-header {
        padding: vars.$spacing-base;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .result-title {
          font-size: vars.$font-size-base;
          font-weight: bold;
          color: vars.$text-color;
        }
        
        .result-status {
          font-size: vars.$font-size-lg;
        }
      }
      
      .result-content {
        padding: 0 vars.$spacing-base vars.$spacing-base;
        
        .result-message {
          font-size: vars.$font-size-sm;
          color: vars.$text-light;
          display: block;
          margin-bottom: vars.$spacing-sm;
        }
        
        .result-data {
          background: vars.$background-color;
          border-radius: vars.$border-radius-sm;
          padding: vars.$spacing-sm;
          
          .data-label {
            font-size: vars.$font-size-xs;
            color: vars.$text-light;
            display: block;
            margin-bottom: vars.$spacing-xs;
          }
          
          .data-content {
            font-size: vars.$font-size-xs;
            color: vars.$text-color;
            font-family: monospace;
            white-space: pre-wrap;
            word-break: break-all;
          }
        }
      }
    }
  }
}

.api-info {
  .info-item {
    background: vars.$white;
    border-radius: vars.$border-radius-base;
    padding: vars.$spacing-base;
    margin-bottom: vars.$spacing-base;
    box-shadow: vars.$box-shadow-sm;
    
    .info-label {
      font-size: vars.$font-size-sm;
      color: vars.$text-light;
      display: block;
      margin-bottom: vars.$spacing-xs;
    }
    
    .info-value {
      font-size: vars.$font-size-sm;
      color: vars.$text-color;
      word-break: break-all;
    }
  }
}
</style>