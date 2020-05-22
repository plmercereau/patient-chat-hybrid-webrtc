import { PeerServer } from 'src/common/types'
// import { LocalStorage } from 'quasar'

export interface State {
  server: PeerServer | null
  servers: PeerServer[]
  hostname: string | null
  runServer: boolean
}

export default function(): State {
  return {
    server: null, // LocalStorage.getItem<PeerServer>('server'),
    servers: [],
    hostname: null,
    runServer: true // TODO set as a param as well
  }
}
