const { app, Menu, Tray  } = require('electron')
const path = require('path')
const {show: showMainWindow} = require('../windows/main')
const {create: createAboutWindow}= require('../windows/about')

let tray;

function setTray() {
  tray = new Tray(path.resolve(__dirname, './icon_win32.png'))
  tray.on('click', () => {
    showMainWindow()
  })
  tray.on('right-click', () => {
    const contextMenu = Menu.buildFromTemplate([
      { label: '打开' + app.name, click: showMainWindow},
      { label: '关于' + app.name, click: createAboutWindow},
      { type: 'separator' },
      { label: '退出', click: () => {app.quit()}}
    ])
    tray.popUpContextMenu(contextMenu)
  })
  tray.on('drop-files', (e, files) => {
    console.log('files', files)
  })
  tray.on('drop-text', (e, text) => {
    console.log('text', text)

  })
}

function setAppMenu() {
  let appMenu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          label: 'About',
          click: createAboutWindow
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ],

    },
    { role: 'fileMenu' },
    { role: 'windowMenu' },
    { role: 'editMenu' }
  ]);
  app.applicationMenu = appMenu;
}

app.whenReady().then(() => {
  setTray()
  setAppMenu()
})



