const { app } = require('electron');
const handleIPC = require('./ipc');
const isDev = require('electron-is-dev');
const { create: createMainWindow, show: showMainWindow, close: closeMainWindow } = require('./windows/main');
const remoteMain = require('@electron/remote/main');
// const { create: createControlWindow } = require('./windows/control');
if (require("electron-squirrel-startup")) {
  (async () => {
    app.quit();
  })();
}

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  // 如果已经存在同样的进程了，则退出
  app.quit()
} else {
  app.on('second-instance', () => {
    showMainWindow()
  })
  app.on('will-finish-launching', () => {
    // if (!isDev) {
    //   require('./updater.js')
    // }
    require('./crash-reporter').init()
  })
  app.on('ready', () => {
    remoteMain.initialize()
    require('./globalShortcut.js')()
    createMainWindow()
    // createControlWindow()
    handleIPC()
    require('./trayAndMenu')
    require('./robot.js')()
  })
  app.on('before-quit', () => {
    closeMainWindow()
  })
  app.on('activate', () => {
    showMainWindow()
  })
}