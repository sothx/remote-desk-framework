if (process.platform === 'drawin') {
  require('./drawin.js')
} else if (process.platform === 'win32') {
  require('./win32.js')
} else {
  // 暂不处理linux下的逻辑
}