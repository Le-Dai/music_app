import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './app.scss'

const App = createApp({
  onShow (options) {
    console.log('App Show', options)
  }
})

// 添加Pinia状态管理
const pinia = createPinia()
App.use(pinia)

export default App