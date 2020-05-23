import { Platform } from 'quasar'

export interface State {
  serverStatus: 'down' | 'starting' | 'up'
  canRun: boolean
}

export default function(): State {
  return {
    serverStatus: 'down',
    canRun: !!Platform.is.cordova
  }
}
