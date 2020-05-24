import { PeerServer } from 'src/common/types'

export interface State {
  server: PeerServer | null
  servers: PeerServer[]
  hostName: string
  userName: string | undefined
  ready: boolean
  connected: boolean
  calling: boolean
  remoteUserName: string | undefined
  local: boolean
}

export default (): State => {
  return {
    server: null, // LocalStorage.getItem<PeerServer>('server'), // TODO set again and test
    servers: [],
    hostName: 'localhost',
    userName: undefined, // TODO localstorage
    ready: false,
    connected: false,
    calling: false,
    remoteUserName: undefined,
    local: false
  }
}
