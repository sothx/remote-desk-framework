const { BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const remoteMain = require('@electron/remote/main');
let win
let willQuitApp = false
function create() {
  win = new BrowserWindow({
    width: 600,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })
  remoteMain.enable(win.webContents)
  // 假关闭
  win.on('close', (e) => {
    if (willQuitApp) {
      win = null
    } else {
    // 阻止默认关闭事件
    e.preventDefault()
    // 把窗口隐藏
    win.hide()
    }
  })
  
  if (isDev) {
    win.loadURL('http://localhost:3000')
  } else {
    win.loadFile(path.resolve(__dirname, '../../renderer/pages/main/index.html'))
  }
}

function send(channel, ...args) {
  win.webContents.send(channel, ...args)
}

function show() {
  win.show()
}

function close() {
  willQuitApp = true
  win.close()
}

module.exports = {
  create,
  send,
  show,
  close
}