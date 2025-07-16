<template>
  <view class="mini-player" @tap="goToPlayer">
    <view class="mini-player-content">
      <image :src="currentMusic?.cover" class="music-cover" mode="aspectFill" />
      
      <view class="music-info">
        <view class="music-title">{{ currentMusic?.title }}</view>
        <view class="music-artist">{{ currentMusic?.artist }}</view>
      </view>
      
      <view class="player-controls" @tap.stop="">
        <view class="control-btn" @tap="togglePlay">
          <text :class="['iconfont', isPlaying ? 'icon-pause' : 'icon-play']"></text>
        </view>
        <view class="control-btn" @tap="nextMusic">
          <text class="iconfont icon-next"></text>
        </view>
      </view>
    </view>
    
    <!-- 进度条 -->
    <view class="progress-bar">
      <view 
        class="progress-fill" 
        :style="{ width: progress + '%' }"
      ></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Taro from '@tarojs/taro'
import { useMusicStore } from '@/store/music'

const musicStore = useMusicStore()

const currentMusic = computed(() => musicStore.currentMusic)
const isPlaying = computed(() => musicStore.isPlaying)
const progress = computed(() => musicStore.progress)

const togglePlay = () => {
  if (isPlaying.value) {
    musicStore.pauseMusic()
  } else {
    musicStore.resumeMusic()
  }
}

const nextMusic = () => {
  musicStore.nextMusic()
}

const goToPlayer = () => {
  Taro.navigateTo({
    url: '/pages/player/index'
  })
}
</script>

<style lang="scss" scoped>
.mini-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $white;
  border-top: 1rpx solid $border-color;
  z-index: 999;
  
  .mini-player-content {
    display: flex;
    align-items: center;
    padding: $spacing-base;
    height: 100rpx;
    
    .music-cover {
      width: 80rpx;
      height: 80rpx;
      border-radius: $border-radius-sm;
      margin-right: $spacing-base;
    }
    
    .music-info {
      flex: 1;
      min-width: 0;
      
      .music-title {
        font-size: $font-size-base;
        color: $text-color;
        margin-bottom: $spacing-xs;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .music-artist {
        font-size: $font-size-sm;
        color: $text-light;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    
    .player-controls {
      display: flex;
      align-items: center;
      
      .control-btn {
        width: 80rpx;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: $spacing-sm;
        
        .iconfont {
          font-size: 40rpx;
          color: $music-primary;
        }
      }
    }
  }
  
  .progress-bar {
    height: 4rpx;
    background-color: #f0f0f0;
    position: relative;
    
    .progress-fill {
      height: 100%;
      background-color: $music-primary;
      transition: width 0.3s ease;
    }
  }
}

// 图标字体样式
.iconfont {
  font-family: 'iconfont';
}

.icon-play::before {
  content: '▶';
}

.icon-pause::before {
  content: '⏸';
}

.icon-next::before {
  content: '⏭';
}
</style>