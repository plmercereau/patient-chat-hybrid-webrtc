import { store } from 'src/store'

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

export const startServer = () =>
  new Promise<void>((resolve, reject) => {
    if (!nodejs) resolve()
    else {
      nodejs.channel.on('ready', () => {
        console.log('"ready" event received. Dispatching to the store...')
        store.dispatch('server/ready')
      })
      nodejs.start('main.js', err => {
        if (err) {
          console.log(err)
          reject()
        } else {
          console.log('Node.js Mobile Engine Started')
          resolve()
        }
      })
    }
  })
