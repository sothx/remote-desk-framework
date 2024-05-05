const peer = require('./peer-control');

peer.on('add-stream', (stream) => {
  console.log('play stream')
  play(stream)
})

const video = document.getElementById('screen-video')
function play(stream) {
  video.srcObject = stream;
  video.onloadedmetadata = function () {
    video.play();
  }
}

window.onkeydown = function (e) {
  // data { keyCode, meta, alt, ctrl, shift }
  const data = {
    keyCode: e.keyCode,
    shift: e.shiftKey,
    meta: e.metaKey,
    control: e.ctrlKey,
    alt: e.altKey
  }
  peer.emit('robot', 'key', data)
}

window.onmouseup = function (e) {
  // data {clientX， clientY， screen: { width, height }, video: { width, height }}
  const data = {
    clientX: e.clientX,
    clientY: e.clientY,
    video: {
      width: video.getBoundingClientRect().width,
      height: video.getBoundingClientRect().height
    }
  }
  peer.emit('robot', 'mouse', data)
}