/**
 * 用户状态管理
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'
import userApi from '../api/user'
import type { User, LoginRequest, RegisterRequest, UpdateUserRequest, UserStats } from '../types/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string>('')
  const isLoggedIn = ref<boolean>(false)
  const userStats = ref<UserStats | null>(null)
  const loading = ref<boolean>(false)

  // 计算属性
  const userInfo = computed(() => user.value)
  const hasToken = computed(() => !!token.value)
  const isStudent = computed(() => !!user.value?.studentId)

  // 初始化用户状态
  const initUserState = () => {
    try {
      const storedToken = Taro.getStorageSync('access_token')
      const storedUser = Taro.getStorageSync('user_info')
      
      if (storedToken) {
        token.value = storedToken
        isLoggedIn.value = true
      }
      
      if (storedUser) {
        user.value = JSON.parse(storedUser)
      }
    } catch (error) {
      console.error('初始化用户状态失败:', error)
      clearUserState()
    }
  }

  // 清除用户状态
  const clearUserState = () => {
    user.value = null
    token.value = ''
    isLoggedIn.value = false
    userStats.value = null
    
    // 清除本地存储
    Taro.removeStorageSync('access_token')
    Taro.removeStorageSync('user_info')
    Taro.removeStorageSync('refresh_token')
  }

  // 保存用户状态到本地
  const saveUserState = (userData: User, accessToken: string, refreshToken?: string) => {
    user.value = userData
    token.value = accessToken
    isLoggedIn.value = true
    
    // 保存到本地存储
    Taro.setStorageSync('access_token', accessToken)
    Taro.setStorageSync('user_info', JSON.stringify(userData))
    
    if (refreshToken) {
      Taro.setStorageSync('refresh_token', refreshToken)
    }
  }

  // 用户登录
  const login = async (loginData: LoginRequest): Promise<boolean> => {
    try {
      loading.value = true
      const response = await userApi.login(loginData)
      
      if (response.success && response.data) {
        const { user: userData, token: accessToken, refreshToken } = response.data
        saveUserState(userData, accessToken, refreshToken)
        
        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        })
        
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('登录失败:', error)
      Taro.showToast({
        title: error.message || '登录失败',
        icon: 'none'
      })
      return false
    } finally {
      loading.value = false
    }
  }

  // 用户注册
  const register = async (registerData: RegisterRequest): Promise<boolean> => {
    try {
      loading.value = true
      const response = await userApi.register(registerData)
      
      if (response.success && response.data) {
        const { user: userData, token: accessToken, refreshToken } = response.data
        saveUserState(userData, accessToken, refreshToken)
        
        Taro.showToast({
          title: '注册成功',
          icon: 'success'
        })
        
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('注册失败:', error)
      Taro.showToast({
        title: error.message || '注册失败',
        icon: 'none'
      })
      return false
    } finally {
      loading.value = false
    }
  }

  // 获取当前用户信息
  const getCurrentUser = async (): Promise<void> => {
    try {
      const response = await userApi.getCurrentUser()
      
      if (response.success && response.data) {
        user.value = response.data
        // 更新本地存储
        Taro.setStorageSync('user_info', JSON.stringify(response.data))
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 如果是401错误，清除用户状态
      if (error.code === 401) {
        clearUserState()
      }
    }
  }

  // 更新用户信息
  const updateUser = async (updateData: UpdateUserRequest): Promise<boolean> => {
    try {
      loading.value = true
      const response = await userApi.updateUser(updateData)
      
      if (response.success && response.data) {
        user.value = response.data
        // 更新本地存储
        Taro.setStorageSync('user_info', JSON.stringify(response.data))
        
        Taro.showToast({
          title: '更新成功',
          icon: 'success'
        })
        
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('更新用户信息失败:', error)
      Taro.showToast({
        title: error.message || '更新失败',
        icon: 'none'
      })
      return false
    } finally {
      loading.value = false
    }
  }

  // 上传头像
  const uploadAvatar = async (filePath: string): Promise<boolean> => {
    try {
      loading.value = true
      const response = await userApi.uploadAvatar(filePath)
      
      if (response.success && response.data) {
        // 更新用户头像
        if (user.value) {
          user.value.avatarUrl = response.data.avatarUrl
          Taro.setStorageSync('user_info', JSON.stringify(user.value))
        }
        
        Taro.showToast({
          title: '头像更新成功',
          icon: 'success'
        })
        
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('头像上传失败:', error)
      Taro.showToast({
        title: error.message || '头像上传失败',
        icon: 'none'
      })
      return false
    } finally {
      loading.value = false
    }
  }

  // 获取用户统计信息
  const getUserStats = async (): Promise<void> => {
    try {
      const response = await userApi.getUserStats()
      
      if (response.success && response.data) {
        userStats.value = response.data
      }
    } catch (error) {
      console.error('获取用户统计失败:', error)
    }
  }

  // 用户登出
  const logout = async (): Promise<void> => {
    try {
      await userApi.logout()
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      // 无论成功失败都清除本地状态
      clearUserState()
      
      Taro.showToast({
        title: '已退出登录',
        icon: 'success'
      })
      
      // 跳转到登录页
      setTimeout(() => {
        Taro.redirectTo({
          url: '/pages/login/index'
        })
      }, 1000)
    }
  }

  // 检查登录状态
  const checkLoginStatus = async (): Promise<boolean> => {
    if (!hasToken.value) {
      return false
    }
    
    try {
      await getCurrentUser()
      return true
    } catch (error) {
      clearUserState()
      return false
    }
  }

  // 微信登录
  const wechatLogin = async (): Promise<boolean> => {
    try {
      loading.value = true
      
      // 获取微信授权码
      const loginResult = await Taro.login()
      if (!loginResult.code) {
        throw new Error('获取微信授权码失败')
      }
      
      // 调用登录接口
      return await login({
        loginType: 'wechat',
        wechatCode: loginResult.code
      })
    } catch (error: any) {
      console.error('微信登录失败:', error)
      Taro.showToast({
        title: error.message || '微信登录失败',
        icon: 'none'
      })
      return false
    } finally {
      loading.value = false
    }
  }

  // 自动登录（应用启动时调用）
  const autoLogin = async (): Promise<void> => {
    initUserState()
    
    if (hasToken.value) {
      try {
        await getCurrentUser()
        await getUserStats()
      } catch (error) {
        console.error('自动登录失败:', error)
        clearUserState()
      }
    }
  }

  return {
    // 状态
    user: userInfo,
    token,
    isLoggedIn,
    userStats,
    loading,
    
    // 计算属性
    hasToken,
    isStudent,
    
    // 方法
    login,
    register,
    logout,
    getCurrentUser,
    updateUser,
    uploadAvatar,
    getUserStats,
    checkLoginStatus,
    wechatLogin,
    autoLogin,
    clearUserState,
    initUserState
  }
})

export default useUserStore