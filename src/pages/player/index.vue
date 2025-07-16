<template>
  <view class="player-page">
    <!-- 头部导航 -->
    <view class="player-header">
      <view class="back-btn" @tap="goBack">
        <text class="iconfont icon-back">←</text>
      </view>
      <view class="header-info">
        <view class="music-title">{{ currentMusic?.title || '暂无播放' }}</view>
        <view class="music-artist">{{ currentMusic?.artist || '' }}</view>
      </view>
      <view class="more-btn">
        <text class="iconfont icon-more">⋯</text>
      </view>
    </view>

    <!-- 专辑封面 -->
    <view class="album-container">
      <view class="album-wrapper" :class="{ rotating: isPlaying }">
        <image 
          :src="currentMusic?.cover || 'https://picsum.photos/300/300?random=default'" 
          class="album-cover" 
          mode="aspectFill" 
        />
      </view>
    </view>

    <!-- 歌词区域 -->
    <view class="lyric-container">
      <scroll-view scroll-y class="lyric-scroll">
        <view class="lyric-line active">{{ currentMusic?.title || '暂无歌词' }}</view>
        <view class="lyric-line">{{ currentMusic?.artist || '' }}</view>
        <view class="lyric-line">欣赏这美妙的音乐</view>
        <view class="lyric-line">让心情随之飞扬</view>
      </scroll-view>
    </view>

    <!-- 进度控制 -->
    <view class="progress-container">
      <view class="time-info">
        <text class="current-time">{{ formatTime(currentTime) }}</text>
        <text class="total-time">{{ formatTime(duration) }}</text>
      </view>
      <view class="progress-wrapper">
        <slider
          :value="progress"
          :disabled="duration === 0"
          @change="onProgressChange"
          @changing="onProgressChanging"
          activeColor="#ff4757"
          backgroundColor="#e0e0e0"
          block-size="12"
        />
      </view>
    </view>

    <!-- 播放控制 -->
    <view class="control-container">
      <view class="control-item" @tap="togglePlayMode">
        <text class="iconfont control-icon">{{ playModeIcon }}</text>
      </view>
      
      <view class="control-item" @tap="prevMusic">
        <text class="iconfont control-icon">⏮</text>
      </view>
      
      <view class="control-item play-btn" @tap="togglePlay">
        <text class="iconfont play-icon">{{ isPlaying ? '⏸' : '▶' }}</text>
      </view>
      
      <view class="control-item" @tap="nextMusic">
        <text class="iconfont control-icon">⏭</text>
      </view>
      
      <view class="control-item" @tap="toggleFavorite">
        <text class="iconfont control-icon">{{ isFavorite ? '❤' : '♡' }}</text>
      </view>
    </view>

    <!-- 音量控制 -->
    <view class="volume-container">
      <text class="volume-icon">🔊</text>
      <slider
        :value="volume * 100"
        @change="onVolumeChange"
        activeColor="#ff4757"
        backgroundColor="#e0e0e0"
        block-size="10"
        class="volume-slider"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Taro from '@tarojs/taro'
import { useMusicStore } from '@/store/music'

const musicStore = useMusicStore()

// 状态
const isFavorite = ref(false)
const audioContext = ref(null)
const isUserSeeking = ref(false)

// 计算属性
const currentMusic = computed(() => musicStore.currentMusic)
const isPlaying = computed(() => musicStore.isPlaying)
const currentTime = computed(() => musicStore.currentTime)
const duration = computed(() => musicStore.duration)
const volume = computed(() => musicStore.volume)
const progress = computed(() => musicStore.progress)
const playMode = computed(() => musicStore.playMode)

const playModeIcon = computed(() => {
  switch (playMode.value) {
    case 'sequence': return '🔄'
    case 'loop': return '🔁'
    case 'random': return '🔀'
    default: return '🔄'
  }
})

// 方法
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const goBack = () => {
  Taro.navigateBack()
}

const togglePlay = () => {
  if (!audioContext.value || !currentMusic.value) return
  
  if (isPlaying.value) {
    audioContext.value.pause()
    musicStore.pauseMusic()
  } else {
    audioContext.value.play()
    musicStore.resumeMusic()
  }
}

const prevMusic = () => {
  musicStore.prevMusic()
  if (currentMusic.value && audioContext.value) {
    loadAndPlayMusic()
  }
}

const nextMusic = () => {
  musicStore.nextMusic()
  if (currentMusic.value && audioContext.value) {
    loadAndPlayMusic()
  }
}

const togglePlayMode = () => {
  const modes: Array<'sequence' | 'loop' | 'random'> = ['sequence', 'loop', 'random']
  const currentIndex = modes.indexOf(playMode.value)
  const nextIndex = (currentIndex + 1) % modes.length
  musicStore.setPlayMode(modes[nextIndex])
  
  Taro.showToast({
    title: getPlayModeText(modes[nextIndex]),
    icon: 'none',
    duration: 1000
  })
}

const getPlayModeText = (mode) => {
  switch (mode) {
    case 'sequence': return '顺序播放'
    case 'loop': return '单曲循环'
    case 'random': return '随机播放'
    default: return '顺序播放'
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  Taro.showToast({
    title: isFavorite.value ? '已添加到收藏' : '已取消收藏',
    icon: 'none',
    duration: 1000
  })
}

const onProgressChange = (e) => {
  if (!audioContext.value || duration.value === 0) return
  
  const newTime = (e.detail.value / 100) * duration.value
  audioContext.value.seek(newTime)
  musicStore.setCurrentTime(newTime)
  isUserSeeking.value = false
}

const onProgressChanging = () => {
  isUserSeeking.value = true
}

const onVolumeChange = (e) => {
  const newVolume = e.detail.value / 100
  musicStore.setVolume(newVolume)
  if (audioContext.value) {
    audioContext.value.volume = newVolume
  }
}

const initAudioContext = () => {
  audioContext.value = Taro.createInnerAudioContext()
  
  audioContext.value.onCanplay(() => {
    if (audioContext.value) {
      musicStore.setDuration(audioContext.value.duration)
      if (isPlaying.value) {
        audioContext.value.play()
      }
    }
  })
  
  audioContext.value.onTimeUpdate(() => {
    if (audioContext.value && !isUserSeeking.value) {
      musicStore.setCurrentTime(audioContext.value.currentTime)
    }
  })
  
  audioContext.value.onEnded(() => {
    if (playMode.value === 'loop') {
      audioContext.value?.play()
    } else {
      nextMusic()
    }
  })
  
  audioContext.value.onError((error) => {
    console.error('音频播放错误:', error)
    Taro.showToast({
      title: '播放失败',
      icon: 'none'
    })
  })
}

const loadAndPlayMusic = () => {
  if (!audioContext.value || !currentMusic.value) return
  
  audioContext.value.src = currentMusic.value.url
  audioContext.value.volume = volume.value
  
  if (isPlaying.value) {
    audioContext.value.play()
  }
}

onMounted(() => {
  initAudioContext()
  if (currentMusic.value) {
    loadAndPlayMusic()
  }
})

onUnmounted(() => {
  if (audioContext.value) {
    audioContext.value.destroy()
  }
})

// 监听音乐变化
Taro.eventCenter.on('musicChanged', () => {
  if (currentMusic.value && audioContext.value) {
    loadAndPlayMusic()
  }
})
</script>

<style lang="scss" scoped>
.player-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: white;
  overflow: hidden;
}

.player-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg $spacing-base;
  padding-top: calc($spacing-lg + env(safe-area-inset-top));
  
  .back-btn, .more-btn {
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .iconfont {
      font-size: 40rpx;
      color: white;
    }
  }
  
  .header-info {
    flex: 1;
    text-align: center;
    
    .music-title {
      font-size: $font-size-lg;
      font-weight: bold;
      margin-bottom: $spacing-xs;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .music-artist {
      font-size: $font-size-sm;
      opacity: 0.8;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.album-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $spacing-xl 0;
  
  .album-wrapper {
    width: 500rpx;
    height: 500rpx;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.3);
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20rpx;
      height: 20rpx;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
    
    &.rotating {
      animation: rotate 20s linear infinite;
    }
    
    .album-cover {
      width: 100%;
      height: 100%;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.lyric-container {
  height: 200rpx;
  padding: 0 $spacing-lg;
  
  .lyric-scroll {
    height: 100%;
    
    .lyric-line {
      text-align: center;
      font-size: $font-size-base;
      line-height: 2;
      opacity: 0.6;
      transition: all 0.3s ease;
      
      &.active {
        opacity: 1;
        font-size: $font-size-lg;
        color: #ffd700;
      }
    }
  }
}

.progress-container {
  padding: $spacing-lg;
  
  .time-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: $spacing-base;
    font-size: $font-size-sm;
    opacity: 0.8;
  }
  
  .progress-wrapper {
    padding: 0 $spacing-sm;
  }
}

.control-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: $spacing-lg;
  
  .control-item {
    display: flex;
    align-items: center;
    justify-content: center;
    
    .control-icon {
      font-size: 50rpx;
      opacity: 0.8;
    }
    
    &.play-btn {
      width: 120rpx;
      height: 120rpx;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      backdrop-filter: blur(10rpx);
      
      .play-icon {
        font-size: 60rpx;
        opacity: 1;
      }
    }
  }
}

.volume-container {
  display: flex;
  align-items: center;
  padding: 0 $spacing-lg $spacing-xl;
  
  .volume-icon {
    font-size: 40rpx;
    margin-right: $spacing-base;
    opacity: 0.8;
  }
  
  .volume-slider {
    flex: 1;
  }
}
</style>