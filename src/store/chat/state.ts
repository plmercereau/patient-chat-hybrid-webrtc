import { PeerServer } from '../../common'
import { LocalStorage, Platform } from 'quasar'

export interface State {
  server: PeerServer | null
  servers: PeerServer[]
  hostname: string | null
  runServer: boolean
}

export default function(): State {
  return {
    server: LocalStorage.getItem<PeerServer>('server'),
    servers: [],
    hostname: null,
    runServer: !!Platform.is.cordova // TODO set as a param as well
  }
}
