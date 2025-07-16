<template>
  <view class="search-page">
    <!-- 搜索框 -->
    <view class="search-header">
      <view class="search-input-wrapper">
        <input
          v-model="searchKeyword"
          class="search-input"
          placeholder="搜索歌曲、歌手、专辑"
          confirm-type="search"
          @confirm="handleSearch"
          @input="onInputChange"
        />
        <view class="search-btn" @tap="handleSearch">
          <text class="iconfont">🔍</text>
        </view>
      </view>
    </view>

    <!-- 热门搜索 -->
    <view v-if="!searchKeyword && !searchResults.length" class="hot-search">
      <view class="section-title">热门搜索</view>
      <view class="hot-tags">
        <view
          v-for="tag in hotSearchTags"
          :key="tag"
          class="hot-tag"
          @tap="searchByTag(tag)"
        >
          {{ tag }}
        </view>
      </view>
    </view>

    <!-- 搜索历史 -->
    <view v-if="!searchKeyword && !searchResults.length && searchHistory.length" class="search-history">
      <view class="section-header">
        <view class="section-title">搜索历史</view>
        <view class="clear-btn" @tap="clearHistory">
          <text class="iconfont">🗑</text>
        </view>
      </view>
      <view class="history-list">
        <view
          v-for="(item, index) in searchHistory"
          :key="index"
          class="history-item"
          @tap="searchByTag(item)"
        >
          <text class="history-text">{{ item }}</text>
          <view class="remove-btn" @tap.stop="removeHistoryItem(index)">
            <text class="iconfont">✕</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view v-if="searchResults.length" class="search-results">
      <view class="section-title">搜索结果 ({{ searchResults.length }})</view>
      <view class="result-list">
        <view
          v-for="(music, index) in searchResults"
          :key="music.id"
          class="result-item"
          @tap="playSearchResult(music, index)"
        >
          <image :src="music.cover" class="music-cover" mode="aspectFill" />
          <view class="music-info">
            <view class="music-title">{{ music.title }}</view>
            <view class="music-artist">{{ music.artist }} - {{ music.album }}</view>
          </view>
          <view class="music-duration">{{ formatTime(music.duration) }}</view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="searchKeyword && !searchResults.length && !isSearching" class="empty-state">
      <view class="empty-icon">🔍</view>
      <view class="empty-text">没有找到相关歌曲</view>
      <view class="empty-tip">试试其他关键词吧</view>
    </view>

    <!-- 加载状态 -->
    <view v-if="isSearching" class="loading-state">
      <view class="loading-icon">⏳</view>
      <view class="loading-text">搜索中...</view>
    </view>

    <!-- 迷你播放器 -->
    <MiniPlayer v-if="currentMusic" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { useMusicStore } from '@/store/music'
import MiniPlayer from '@/components/MiniPlayer/index.vue'
// import type { Music } from '@/types/music'

const musicStore = useMusicStore()

// 状态
const searchKeyword = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const searchHistory = ref([])

// 热门搜索标签
const hotSearchTags = ref([
  '周杰伦',
  '林俊杰',
  '邓紫棋',
  '张学友',
  '王菲',
  '陈奕迅',
  '李荣浩',
  '毛不易'
])

// 模拟搜索数据
const mockSearchData = [
  {
    id: 101,
    title: '晴天',
    artist: '周杰伦',
    album: '叶惠美',
    duration: 269,
    cover: 'https://picsum.photos/100/100?random=101',
    url: 'https://music.163.com/song/media/outer/url?id=186017'
  },
  {
    id: 102,
    title: '修炼爱情',
    artist: '林俊杰',
    album: '修炼爱情',
    duration: 247,
    cover: 'https://picsum.photos/100/100?random=102',
    url: 'https://music.163.com/song/media/outer/url?id=1299550532'
  },
  {
    id: 103,
    title: '泡沫',
    artist: '邓紫棋',
    album: 'Xposed',
    duration: 244,
    cover: 'https://picsum.photos/100/100?random=103',
    url: 'https://music.163.com/song/media/outer/url?id=254543'
  },
  {
    id: 104,
    title: '吻别',
    artist: '张学友',
    album: '吻别',
    duration: 283,
    cover: 'https://picsum.photos/100/100?random=104',
    url: 'https://music.163.com/song/media/outer/url?id=212183'
  },
  {
    id: 105,
    title: '传奇',
    artist: '王菲',
    album: '唱游',
    duration: 223,
    cover: 'https://picsum.photos/100/100?random=105',
    url: 'https://music.163.com/song/media/outer/url?id=212188'
  }
]

const currentMusic = computed(() => musicStore.currentMusic)

// 方法
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const onInputChange = (e) => {
  searchKeyword.value = e.detail.value
  if (!searchKeyword.value) {
    searchResults.value = []
  }
}

const handleSearch = async () => {
  if (!searchKeyword.value.trim()) return

  isSearching.value = true
  
  // 模拟搜索延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 模拟搜索结果
  const keyword = searchKeyword.value.toLowerCase()
  searchResults.value = mockSearchData.filter(music => 
    music.title.toLowerCase().includes(keyword) ||
    music.artist.toLowerCase().includes(keyword) ||
    music.album.toLowerCase().includes(keyword)
  )
  
  // 添加到搜索历史
  addToHistory(searchKeyword.value)
  
  isSearching.value = false
}

const searchByTag = (tag) => {
  searchKeyword.value = tag
  handleSearch()
}

const addToHistory = (keyword) => {
  // 移除重复项
  const index = searchHistory.value.indexOf(keyword)
  if (index > -1) {
    searchHistory.value.splice(index, 1)
  }
  
  // 添加到开头
  searchHistory.value.unshift(keyword)
  
  // 限制历史记录数量
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }
  
  // 保存到本地存储
  Taro.setStorageSync('searchHistory', searchHistory.value)
}

const removeHistoryItem = (index) => {
  searchHistory.value.splice(index, 1)
  Taro.setStorageSync('searchHistory', searchHistory.value)
}

const clearHistory = () => {
  Taro.showModal({
    title: '确认清空',
    content: '确定要清空搜索历史吗？',
    success: (res) => {
      if (res.confirm) {
        searchHistory.value = []
        Taro.removeStorageSync('searchHistory')
      }
    }
  })
}

const playSearchResult = (music, index) => {
  musicStore.setMusicList(searchResults.value)
  musicStore.playMusic(music, index)
  
  Taro.navigateTo({
    url: '/pages/player/index'
  })
}

onMounted(() => {
  // 从本地存储加载搜索历史
  try {
    const history = Taro.getStorageSync('searchHistory')
    if (Array.isArray(history)) {
      searchHistory.value = history
    }
  } catch (error) {
    console.error('加载搜索历史失败:', error)
  }
})
</script>

<style lang="scss" scoped>
.search-page {
  background-color: $background-color;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.search-header {
  background-color: $white;
  padding: $spacing-base;
  border-bottom: 1rpx solid $border-color;
  
  .search-input-wrapper {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: $border-radius-lg;
    padding: 0 $spacing-base;
    
    .search-input {
      flex: 1;
      height: 80rpx;
      font-size: $font-size-base;
      color: $text-color;
    }
    
    .search-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .iconfont {
        font-size: 32rpx;
        color: $text-light;
      }
    }
  }
}

.hot-search, .search-history {
  background-color: $white;
  margin-top: $spacing-base;
  padding: $spacing-base;
  
  .section-title {
    font-size: $font-size-lg;
    color: $text-color;
    margin-bottom: $spacing-base;
    font-weight: bold;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-base;
    
    .clear-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .iconfont {
        font-size: 32rpx;
        color: $text-light;
      }
    }
  }
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  
  .hot-tag {
    padding: $spacing-sm $spacing-base;
    background-color: #f5f5f5;
    border-radius: $border-radius-xl;
    font-size: $font-size-sm;
    color: $text-color;
    
    &:active {
      background-color: #e0e0e0;
    }
  }
}

.history-list {
  .history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-base 0;
    border-bottom: 1rpx solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .history-text {
      flex: 1;
      font-size: $font-size-base;
      color: $text-color;
    }
    
    .remove-btn {
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .iconfont {
        font-size: 24rpx;
        color: $text-lighter;
      }
    }
  }
}

.search-results {
  background-color: $white;
  margin-top: $spacing-base;
  
  .section-title {
    font-size: $font-size-lg;
    color: $text-color;
    padding: $spacing-base;
    font-weight: bold;
    border-bottom: 1rpx solid #f0f0f0;
  }
  
  .result-list {
    .result-item {
      display: flex;
      align-items: center;
      padding: $spacing-base;
      border-bottom: 1rpx solid #f9f9f9;
      
      &:active {
        background-color: #f5f5f5;
      }
      
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
      
      .music-duration {
        font-size: $font-size-sm;
        color: $text-lighter;
      }
    }
  }
}

.empty-state, .loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;
  
  .empty-icon, .loading-icon {
    font-size: 100rpx;
    margin-bottom: $spacing-base;
    opacity: 0.6;
  }
  
  .empty-text, .loading-text {
    font-size: $font-size-lg;
    color: $text-light;
    margin-bottom: $spacing-sm;
  }
  
  .empty-tip {
    font-size: $font-size-sm;
    color: $text-lighter;
  }
}
</style>