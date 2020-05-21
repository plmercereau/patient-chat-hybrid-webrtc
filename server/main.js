// Require the 'cordova-bridge' to enable communications between the
// Node.js app and the Cordova app.
const cordova = require('cordova-bridge')
const log = require('./log')
const server = require('./server')

// Send a message to Cordova.
cordova.channel.send('main.js loaded')

// Post an event with a message.
cordova.channel.post('started', 'main.js loaded')

try {
  server(3000, () => {
    cordova.channel.post('ready')
    log('Express server set.')
  })
} catch (error) {
  log('Error starting Express')
  log(error)
}

// A sample object to show how the channel supports generic
// JavaScript objects.
class Reply {
  constructor(replyMsg, originalMsg) {
    this.reply = replyMsg
    this.original = originalMsg
  }
}

// Listen to messages from Cordova.
cordova.channel.on('message', msg => {
  log(`MESSAGE received: ${msg}`)
  // Reply sending a user defined object.
  cordova.channel.send(new Reply('Message received!', JSON.stringify(msg)))
})

// Listen to event 'myevent' from Cordova.
// cordova.channel.on('express', msg => {
//   log('MYEVENT received with message: "%s"', msg)
// })

// Handle the 'pause' and 'resume' events.
// These are events raised automatically when the app switched to the
// background/foreground.
cordova.app.on('pause', pauseLock => {
  log('app paused.')
  pauseLock.release()
})

cordova.app.on('resume', () => {
  log('app resumed.')
  cordova.channel.post('engine', 'resumed')
})
