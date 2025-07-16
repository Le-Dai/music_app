const path = require('path')

const config = {
  projectName: 'music_app',
  date: '2025-6-25',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    375: 2,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-framework-vue3'],
  defineConstants: {},
  alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/assets': path.resolve(__dirname, '..', 'src/assets'),
    '@/pages': path.resolve(__dirname, '..', 'src/pages'),
    '@/store': path.resolve(__dirname, '..', 'src/store'),
    '@/types': path.resolve(__dirname, '..', 'src/types'),
    '@/styles': path.resolve(__dirname, '..', 'src/styles')
  },
  copy: {
    patterns: [],
    options: {}
  },
  framework: 'vue3',
  compiler: 'webpack5',
  cache: {
    enable: false
  },
  sass: {
    resource: [
      path.resolve(__dirname, '..', 'src/styles/variables.scss')
    ]
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false
      }
    }
  },
  mini: {},
  rn: {
    appName: 'musicApp'
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}