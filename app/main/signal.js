const WebSocket = require('ws');
const EventEmiiter = require('events');
const signal = new EventEmiiter()

const ws = new WebSocket('ws://127.0.0.1:8010')

ws.on('open', () => {
  console.log('connect success')
})

ws.on('message', function (message) {
  let data = {};
  try {
    data = JSON.parse(message)
  } catch (e) {
    console.log('parse error', e)
  }

  signal.emit(data.event, data.data)
})

function send(event, data) {
  console.log('sended', JSON.stringify({event, data}))
  ws.send(JSON.stringify({event, data}))
}

function invoke(event, data, answerEvent) {
  return new Promise((resolve, reject) => { 
    send(event, data)
    signal.once(answerEvent, resolve)
    setTimeout(() => {
      reject('timeout')
    },5000)
  })
}

signal.send = send
signal.invoke = invoke

module.exports = signal