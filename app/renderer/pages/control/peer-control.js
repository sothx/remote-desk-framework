const { ipcRenderer } = require('electron');
const EventEmitter = require('events');
const peer = new EventEmitter();
// 以下应该是peer-puppet的代码

const pc = new window.RTCPeerConnection({})

const dc = pc.createDataChannel('robotchannel', {
  reliable: false // 不需要保证可达性，允许一定的丢失
})

dc.onopen = function () {
  peer.on('robot', (type, data) => {
    dc.send(JSON.stringify({ type, data }));
  })
}

dc.onmessage = function (event) {
  console.log('message', event);
}

dc.onerror= (e) => { console.log('error', e) }


async function createOffer() {
 const offer = await pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true
 })
  
  await pc.setLocalDescription(offer)
  console.log('pc offer', JSON.stringify(offer))
  return pc.localDescription
}

createOffer().then((offer) => {
  console.log('forward', 'offer', offer)
  ipcRenderer.send('forward', 'offer', {type: offer.type, sdp: offer.sdp})
})

ipcRenderer.on('answer', (e, answer) => {
  setRemote(answer)
})

ipcRenderer.on('candidate', (e, candidate) => {
  addIceCandidate(candidate)
})

async function setRemote(answer) {
  await pc.setRemoteDescription(answer)
}

// window.setRemote = setRemote

// onicecandidata 拿到iceEvent
// addIceCandidate
pc.onicecandidate = function (e) {
  console.log('candidate', JSON.stringify(e.candidate));
  if (e.candidate) {
    ipcRenderer.send('forward', 'control-candidate', JSON.parse(JSON.stringify(e.candidate)))
  }
}
let candidates = []
async function addIceCandidate(candidate) {
  if (candidate) {
    candidates.push(candidate)
  }
  if(pc.remoteDescription && pc.remoteDescription.type) {
      for(let i = 0; i < candidates.length; i ++) {
          await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
      }
      candidates = []
  } 
}
// window.addIceCandidate = addIceCandidate

pc.onaddstream = function (e) {
  console.log('add stream', e)
  peer.emit('add-stream', e.stream)
}

module.exports = peer;