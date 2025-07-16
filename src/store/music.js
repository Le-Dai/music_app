import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMusicStore = defineStore('music', () => {
  // 状态
  const musicList = ref([])
  const currentMusic = ref(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(1)
  const playMode = ref('sequence')
  const currentIndex = ref(0)

  // 计算属性
  const progress = computed(() => {
    return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
  })

  // 动作
  const setMusicList = (list) => {
    musicList.value = list
  }

  const playMusic = (music, index) => {
    currentMusic.value = music
    if (index !== undefined) {
      currentIndex.value = index
    }
    isPlaying.value = true
  }

  const pauseMusic = () => {
    isPlaying.value = false
  }

  const resumeMusic = () => {
    isPlaying.value = true
  }

  return {
    // 状态
    musicList,
    currentMusic,
    isPlaying,
    currentTime,
    duration,
    volume,
    playMode,
    currentIndex,
    
    // 计算属性
    progress,
    
    // 动作
    setMusicList,
    playMusic,
    pauseMusic,
    resumeMusic
  }
})