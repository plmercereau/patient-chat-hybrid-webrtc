// Require the 'cordova-bridge' to enable communications between the
// Node.js app and the Cordova app.
const cordova = require('cordova-bridge')
const express = require('express')
const port = 3000

// Send a message to Cordova.
cordova.channel.send('main.js loaded')

// Post an event to Cordova.
cordova.channel.post('started')

// Post an event with a message.
cordova.channel.post('started', 'main.js loaded')

try {
  cordova.channel.send('Create Express')
  const app = express()
  cordova.channel.send('Express: Create route')
  app.get('/', (req, res) => res.send('Hello World!'))
  cordova.channel.send('Express: Listen')
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    cordova.channel.send(`Example app listening at http://localhost:${port}`)
  })
} catch (error) {
  cordova.channel.send('Error starting Express')
  cordova.channel.send(JSON.stringify(error))
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
  console.log('[node] MESSAGE received: "%s"', msg)
  // Reply sending a user defined object.
  cordova.channel.send(new Reply('Message received!', msg))
})

// Listen to event 'myevent' from Cordova.
cordova.channel.on('myevent', msg => {
  console.log('[node] MYEVENT received with message: "%s"', msg)
})

// Handle the 'pause' and 'resume' events.
// These are events raised automatically when the app switched to the
// background/foreground.
cordova.app.on('pause', pauseLock => {
  console.log('[node] app paused.')
  pauseLock.release()
})

cordova.app.on('resume', () => {
  console.log('[node] app resumed.')
  cordova.channel.post('engine', 'resumed')
})
