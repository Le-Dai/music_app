<template>
  <view class="practice-page">
    <view class="header">
      <text class="title">练习</text>
    </view>
    <view class="content">
      <view class="card">
        <text class="card-title">练习模块</text>
        <text class="card-desc">通过练习提升技能</text>
      </view>
      <view class="practice-grid">
        <view class="practice-item" v-for="item in practiceItems" :key="item.id">
          <view class="item-icon">{{ item.icon }}</view>
          <text class="item-title">{{ item.title }}</text>
          <text class="item-count">{{ item.count }}题</text>
        </view>
      </view>
    </view>
    <TabBar />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TabBar from '../../components/TabBar.vue'

const practiceItems = ref([
  { id: 1, title: '每日练习', icon: '📝', count: 20 },
  { id: 2, title: '专项训练', icon: '🎯', count: 50 },
  { id: 3, title: '模拟考试', icon: '📋', count: 100 },
  { id: 4, title: '错题集', icon: '❌', count: 15 }
])
</script>

<style lang="scss" scoped>
@use '../../styles/variables.scss' as vars;

.practice-page {
  padding: vars.$spacing-base;
  padding-bottom: 100rpx;
  min-height: 100vh;
  background-color: vars.$background-color;
}

.header {
  text-align: center;
  margin-bottom: vars.$spacing-lg;
  
  .title {
    font-size: vars.$font-size-xxl;
    font-weight: bold;
    color: vars.$music-secondary;
  }
}

.content {
  .card {
    background: vars.$white;
    padding: vars.$spacing-lg;
    border-radius: vars.$border-radius-lg;
    margin-bottom: vars.$spacing-lg;
    box-shadow: vars.$box-shadow-sm;
    
    .card-title {
      font-size: vars.$font-size-lg;
      font-weight: bold;
      color: vars.$text-color;
      display: block;
      margin-bottom: vars.$spacing-sm;
    }
    
    .card-desc {
      font-size: vars.$font-size-base;
      color: vars.$text-light;
    }
  }
  
  .practice-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: vars.$spacing-base;
    
    .practice-item {
      background: vars.$white;
      padding: vars.$spacing-lg;
      border-radius: vars.$border-radius-base;
      box-shadow: vars.$box-shadow-sm;
      text-align: center;
      
      .item-icon {
        font-size: vars.$font-size-xxl;
        margin-bottom: vars.$spacing-sm;
      }
      
      .item-title {
        font-size: vars.$font-size-base;
        color: vars.$text-color;
        display: block;
        margin-bottom: vars.$spacing-xs;
      }
      
      .item-count {
        font-size: vars.$font-size-sm;
        color: vars.$music-secondary;
      }
    }
  }
}
</style>