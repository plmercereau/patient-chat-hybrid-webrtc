import { PeerServer } from 'src/common/types'
// import { LocalStorage } from 'quasar'

export interface State {
  server: PeerServer | null
  servers: PeerServer[]
  hostname: string
}

export default function(): State {
  return {
    server: null, // LocalStorage.getItem<PeerServer>('server'), // TODO set again and test
    servers: [],
    hostname: 'localhost'
  }
}
