interface NodeJSPlugin {
  start: (path: string, callback: (error: Error) => void) => void
  channel: {
    send: (message: string) => void
    setListener: (listener: (message: unknown) => void) => void
    on: (event: string, callback: (message: unknown) => void) => void
    post: (event: string, message: unknown) => void
  }
}

declare const nodejs: NodeJSPlugin

// function channelListener(msg: unknown) {
//   console.log('[cordova] received: ' + JSON.stringify(msg))
// }

function startupCallback(err: unknown) {
  if (err) {
    console.log(err)
  } else {
    console.log('Node.js Mobile Engine Started')
    nodejs.channel.send('Hello from Cordova!')
  }
}

export function startNodeProject(
  readyCallback = function() {
    console.log('READY')
  }
) {
  if (nodejs) {
    nodejs.channel.on('ready', readyCallback)
    // nodejs.channel.setListener(channelListener)
    nodejs.start('main.js', startupCallback)
    // To disable the stdout/stderr redirection to the Android logcat:
    // nodejs.start('main.js', startupCallback, { redirectOutputToLogcat: false });
  }
}
