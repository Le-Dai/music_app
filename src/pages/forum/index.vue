<template>
  <view class="forum-page">
    <view class="header">
      <text class="title">💬 音乐论坛</text>
      <text class="subtitle">分享你的音乐心得</text>
    </view>
    
    <view class="content">
      <view class="section">
        <view class="section-title">热门话题</view>
        <view class="topic-list">
          <view class="topic-item" v-for="(topic, index) in topics" :key="index">
            <view class="topic-title">{{ topic.title }}</view>
            <view class="topic-info">
              <text class="author">{{ topic.author }}</text>
              <text class="replies">{{ topic.replies }}回复</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const topics = ref([
  { title: '如何练习钢琴基础指法？', author: '音乐小白', replies: 15 },
  { title: '分享一些好听的古典音乐', author: '古典迷', replies: 23 },
  { title: '吉他入门教程推荐', author: '吉他手', replies: 8 },
  { title: '音乐理论学习心得', author: '理论家', replies: 12 },
  { title: '推荐几首适合练习的歌曲', author: '练习者', replies: 19 }
])
</script>

<style lang="scss" scoped>
.forum-page {
  padding: 20rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
  padding: 40rpx 0;
  background: white;
  border-radius: 20rpx;
  
  .title {
    font-size: 48rpx;
    color: #ff4757;
    font-weight: bold;
    display: block;
    margin-bottom: 10rpx;
  }
  
  .subtitle {
    font-size: 28rpx;
    color: #666;
  }
}

.content {
  background: white;
  border-radius: 20rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 36rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 30rpx;
}

.topic-list {
  .topic-item {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #eee;
    
    &:last-child {
      border-bottom: none;
    }
    
    .topic-title {
      font-size: 32rpx;
      color: #333;
      margin-bottom: 15rpx;
      line-height: 1.4;
    }
    
    .topic-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .author {
        font-size: 26rpx;
        color: #999;
      }
      
      .replies {
        font-size: 24rpx;
        color: #ff4757;
      }
    }
  }
}
</style>