export interface Music {
  id: number
  title: string
  artist: string
  album: string
  duration: number
  cover: string
  url: string
}

export interface Playlist {
  id: number
  name: string
  cover: string
  musicList: Music[]
}

export interface PlayerState {
  currentMusic: Music | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  playMode: 'sequence' | 'loop' | 'random'
}