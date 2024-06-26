const { ipcMain } = require('electron');
const robot = require('robotjs');
const vkey = require('vkey');

function handleMouse(data) {
  const { clientX, clientY, screen, video } = data;
  // data {clientX， clientY， screen: { width, height }, video: { width, height }}
  let x = clientX * screen.width / video.width
  let y = clientY * screen.height / video.height
  robot.moveMouse(x, y);
  robot.mouseClick();
}

function handleKey(data) {
  // data { keyCode, meta, alt, ctrl, shift }
  const modifiers = []
  if (data.meta) modifiers.push('meta')
  if (data.alt) modifiers.push('alt')
  if (data.control) modifiers.push('control')
  if (data.shift) modifiers.push('shift')
  const key = vkey[data.keyCode].toLowerCase()
  if(key[0] !== '<') { //处理同时按<shift>拿上标字符键的功能
      robot.keyTap(key, modifiers)
  }
}

module.exports = function () {
  ipcMain.on('robot', (e, type, data) => {
    if (type === 'mouse') {
      handleMouse(data)
    } else if (type === 'key') {
      handleKey(data)
    }
  })
}