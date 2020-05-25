import { PeerServer } from 'src/common/types'

export interface State {
  server: PeerServer | null
  servers: PeerServer[]
  userName: string | undefined
  ready: boolean
  connected: boolean
  ongoing: boolean
  remoteUserName: string | undefined
  autoCall: boolean
  autoAnswer: boolean
}

export default (): State => {
  return {
    server: null, // LocalStorage.getItem<PeerServer>('server'), // TODO set again and test
    servers: [],
    userName: undefined, // TODO localstorage
    ready: false,
    connected: false,
    ongoing: false,
    remoteUserName: undefined,
    autoCall: true,
    autoAnswer: true
  }
}
