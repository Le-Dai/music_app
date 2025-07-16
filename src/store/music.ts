import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Music, PlayerState } from '@/types/music'

export const useMusicStore = defineStore('music', () => {
  // 状态
  const musicList = ref<Music[]>([])
  const currentMusic = ref<Music | null>(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(1)
  const playMode = ref<'sequence' | 'loop' | 'random'>('sequence')
  const currentIndex = ref(0)

  // 计算属性
  const playerState = computed<PlayerState>(() => ({
    currentMusic: currentMusic.value,
    isPlaying: isPlaying.value,
    currentTime: currentTime.value,
    duration: duration.value,
    volume: volume.value,
    playMode: playMode.value
  }))

  const progress = computed(() => {
    return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
  })

  // 动作
  const setMusicList = (list: Music[]) => {
    musicList.value = list
  }

  const playMusic = (music: Music, index?: number) => {
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

  const stopMusic = () => {
    isPlaying.value = false
    currentTime.value = 0
  }

  const nextMusic = () => {
    if (musicList.value.length === 0) return

    let nextIndex = currentIndex.value
    
    if (playMode.value === 'random') {
      nextIndex = Math.floor(Math.random() * musicList.value.length)
    } else {
      nextIndex = (currentIndex.value + 1) % musicList.value.length
    }

    currentIndex.value = nextIndex
    currentMusic.value = musicList.value[nextIndex]
    isPlaying.value = true
  }

  const prevMusic = () => {
    if (musicList.value.length === 0) return

    let prevIndex = currentIndex.value
    
    if (playMode.value === 'random') {
      prevIndex = Math.floor(Math.random() * musicList.value.length)
    } else {
      prevIndex = currentIndex.value - 1
      if (prevIndex < 0) {
        prevIndex = musicList.value.length - 1
      }
    }

    currentIndex.value = prevIndex
    currentMusic.value = musicList.value[prevIndex]
    isPlaying.value = true
  }

  const setCurrentTime = (time: number) => {
    currentTime.value = time
  }

  const setDuration = (time: number) => {
    duration.value = time
  }

  const setVolume = (vol: number) => {
    volume.value = Math.max(0, Math.min(1, vol))
  }

  const setPlayMode = (mode: 'sequence' | 'loop' | 'random') => {
    playMode.value = mode
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
    playerState,
    progress,
    
    // 动作
    setMusicList,
    playMusic,
    pauseMusic,
    resumeMusic,
    stopMusic,
    nextMusic,
    prevMusic,
    setCurrentTime,
    setDuration,
    setVolume,
    setPlayMode
  }
})