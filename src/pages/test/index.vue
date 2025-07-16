<template>
  <view class="test-page">
    <view class="header">
      <text class="title">测试</text>
    </view>
    <view class="content">
      <view class="card">
        <text class="card-title">测试模块</text>
        <text class="card-desc">检验学习成果</text>
      </view>
      <view class="test-list">
        <view class="test-item" v-for="item in testItems" :key="item.id">
          <view class="item-left">
            <text class="item-title">{{ item.title }}</text>
            <text class="item-desc">{{ item.desc }}</text>
          </view>
          <view class="item-right">
            <text class="item-score" v-if="item.score">{{ item.score }}分</text>
            <text class="item-status" :class="item.status">{{ item.statusText }}</text>
          </view>
        </view>
      </view>
    </view>
    <TabBar />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TabBar from '../../components/TabBar.vue'

const testItems = ref([
  { 
    id: 1, 
    title: '基础测试', 
    desc: '测试基础知识掌握情况',
    score: 85,
    status: 'completed',
    statusText: '已完成'
  },
  { 
    id: 2, 
    title: '进阶测试', 
    desc: '测试进阶知识掌握情况',
    score: 78,
    status: 'completed',
    statusText: '已完成'
  },
  { 
    id: 3, 
    title: '综合测试', 
    desc: '综合能力测试',
    score: null,
    status: 'available',
    statusText: '可开始'
  }
])
</script>

<style lang="scss" scoped>
@use '../../styles/variables.scss' as vars;

.test-page {
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
    color: vars.$music-accent;
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
  
  .test-list {
    .test-item {
      background: vars.$white;
      padding: vars.$spacing-base;
      border-radius: vars.$border-radius-base;
      margin-bottom: vars.$spacing-base;
      box-shadow: vars.$box-shadow-sm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .item-left {
        flex: 1;
        
        .item-title {
          font-size: vars.$font-size-base;
          color: vars.$text-color;
          display: block;
          margin-bottom: vars.$spacing-xs;
          font-weight: bold;
        }
        
        .item-desc {
          font-size: vars.$font-size-sm;
          color: vars.$text-light;
        }
      }
      
      .item-right {
        text-align: right;
        
        .item-score {
          font-size: vars.$font-size-base;
          color: vars.$music-primary;
          display: block;
          margin-bottom: vars.$spacing-xs;
          font-weight: bold;
        }
        
        .item-status {
          font-size: vars.$font-size-sm;
          padding: 4rpx 12rpx;
          border-radius: vars.$border-radius-sm;
          
          &.completed {
            background-color: rgba(82, 196, 26, 0.1);
            color: vars.$success-color;
          }
          
          &.available {
            background-color: rgba(24, 144, 255, 0.1);
            color: vars.$primary-color;
          }
        }
      }
    }
  }
}
</style>