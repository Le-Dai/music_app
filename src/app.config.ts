export default {
  pages: [
    'pages/index/index',
    'pages/study/index',
    'pages/practice/index',
    'pages/profile/index',
    'pages/forum/index',
    'pages/test/index',
    'pages/api-test/index',
    'pages/player/index',
    'pages/search/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ff4757',
    navigationBarTitleText: '学习助手',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f5f5f5'
  },
  tabBar: {
    color: '#999999',
    selectedColor: '#ff4757',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/study/index',
        text: '学习'
      },
      {
        pagePath: 'pages/practice/index',
        text: '做题'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
}