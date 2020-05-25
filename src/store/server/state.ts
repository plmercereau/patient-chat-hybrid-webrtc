import { Platform } from 'quasar'

export interface State {
  hostName: string
  serverStatus: 'down' | 'starting' | 'up'
  embedded: boolean
}

export default function(): State {
  return {
    hostName: 'localhost',
    serverStatus: 'down',
    embedded: !!Platform.is.cordova
  }
}
