const { app, globalShortcut, BrowserWindow } = require('electron');

module.exports = function () {
  
  function handleChromeDevTools() {
    if (globalShortcut.isRegistered('ctrl+shift+i')) {
      console.log('globalShortcut ctrl+shift+i', 'has_register')

    } else {
      const ret = globalShortcut.register('ctrl+shift+i', () => {
        // 获取当前聚焦窗口
        const currentBrowserWindow = BrowserWindow.getFocusedWindow();
        if (currentBrowserWindow) {
          if (currentBrowserWindow.webContents.isDevToolsOpened()) {
            currentBrowserWindow.webContents.closeDevTools()
          } else {
            currentBrowserWindow.webContents.openDevTools()
          }
        }
      })
      if (!ret) {
        console.error('globalShortcut ctrl+shift+i', 'register_failed')
      }
    }

    app.on('will-quit', function () {
      // Unregister a shortcut.
      globalShortcut.unregister('ctrl+shift+i');
    })
  }

  handleChromeDevTools()

}