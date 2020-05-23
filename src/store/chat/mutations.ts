import { MutationTree } from 'vuex'
import { State } from './state'
import { PeerServer } from 'src/common/types'
import { LocalStorage } from 'quasar'

export const mutations: MutationTree<State> = {
  setServer(state, server: PeerServer) {
    state.server = server
    LocalStorage.set('server', server)
  },
  addServer(state, ...servers: PeerServer[]) {
    state.servers.push(...servers)
  },
  setHostName: (state, hostName: string) => {
    state.hostName = hostName
  },
  setUserName: (state, userName: string) => {
    state.userName = userName
  },
  setRemoteUser: (state, userName: string) => {
    state.remoteUserName = userName
  },
  ready: state => {
    state.ready = true
  },
  connected: state => {
    state.connected = true
  },
  disconnected: state => {
    state.connected = false
  },
  callStart: state => {
    state.calling = true
  },
  callEnd: state => {
    state.calling = false
  }
}
