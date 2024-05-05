const { ipcMain, desktopCapturer, MenuItem, Menu } = require('electron');
const { send: sendMainWindow } = require('./windows/main')
const { create: createControlWindow, send: sendControlWindow } = require('./windows/control');
const signal = require('./signal.js');

module.exports = function () {

  // Electron 17开始desktopCapturer.getSources只能写在主进程
  ipcMain.handle(
    'DESKTOP_CAPTURER_GET_SOURCES',
    (event, opts) => desktopCapturer.getSources(opts)
  )

  // // 右键菜单
  // ipcMain.handle(
  //   'CONTEXT_MENU_POPUP',
  //   (event, opts) => {
  //     event.preventDefault();
  //     const menu = new Menu();
  //     menu.append(new MenuItem({ label: '复制', role: 'copy' }))
  //     menu.popup()
  //   }
  // )

  ipcMain.on(
    'crashTest',
    (event, opts) => {
      process.crash()
      console.log('启动崩溃程序')
    }
  )

  ipcMain.handle('login', async () => {
    // 先mock，返回一个code,六位数
    let { code } = await signal.invoke('login', null, 'logined')
    return code
  })
  ipcMain.on('control', async (e, remote) => {
    // 这里是跟服务端的交互，成功后我们会唤起面板
    signal.send('control', {remote})
})
  // 监听成功控制的事件
  signal.on('controlled', (data) => {
    sendMainWindow('control-state-change', data.remote, 1)
    createControlWindow()
})
  // 监听被控制的事件
  signal.on('be-controlled', (data) => {
    sendMainWindow('control-state-change', data.remote, 2)
})
  // 监听转发信令的事件
  // // puppet、control共享的信道，就是转发
  ipcMain.on('forward', (e, event, data) => {
    signal.send('forward', {event, data})
})

  // 监听RTC offer的事件
  // // 收到offer，puppet响应
  signal.on('offer', (data) => {
    sendMainWindow('offer', data)
})

  // 监听RTC answer事件
  // 收到puppet证书，answer响应
  signal.on('answer', (data) => {
    sendControlWindow('answer', data)
})

  // 监听傀儡端candidate
  // 收到control证书，puppet响应
  signal.on('puppet-candidate', (data) => {
    sendControlWindow('candidate', data)
  })

  // 监听控制端candidate
  //收到puppet证书，control响应
  signal.on('control-candidate', (data) => {
    sendMainWindow('candidate', data)
  })


}