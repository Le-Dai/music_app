<template>
  <view class="study-page">
    <view class="header">
      <text class="title">学习</text>
    </view>
    <view class="content">
      <view class="card">
        <text class="card-title">学习模块</text>
        <text class="card-desc">开始你的学习之旅</text>
      </view>
      <view class="study-list">
        <view class="study-item" v-for="item in studyItems" :key="item.id">
          <text class="item-title">{{ item.title }}</text>
          <text class="item-progress">进度: {{ item.progress }}%</text>
        </view>
      </view>
    </view>
    <!-- <TabBar /> -->
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TabBar from '../../components/TabBar.vue'

const studyItems = ref([
  { id: 1, title: '基础知识', progress: 75 },
  { id: 2, title: '进阶教程', progress: 45 },
  { id: 3, title: '专项训练', progress: 20 }
])
</script>

<style lang="scss" scoped>
@use '../../styles/variables.scss' as vars;

.study-page {
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
    color: vars.$music-primary;
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
  
  .study-list {
    .study-item {
      background: vars.$white;
      padding: vars.$spacing-base;
      border-radius: vars.$border-radius-base;
      margin-bottom: vars.$spacing-base;
      box-shadow: vars.$box-shadow-sm;
      
      .item-title {
        font-size: vars.$font-size-base;
        color: vars.$text-color;
        display: block;
        margin-bottom: vars.$spacing-xs;
      }
      
      .item-progress {
        font-size: vars.$font-size-sm;
        color: vars.$music-primary;
      }
    }
  }
}
</style>