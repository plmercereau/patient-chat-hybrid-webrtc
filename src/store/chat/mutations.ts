import { MutationTree } from 'vuex'
import { State } from './state'
import { PeerServer } from 'src/common/types'
// import { LocalStorage } from 'quasar'

export const mutations: MutationTree<State> = {
  setServer(state, server: PeerServer | null) {
    state.server = server
    // LocalStorage.set('server', server)
  },
  addServer(state, server: PeerServer) {
    if (state.servers.every(s => s.host !== server.host))
      state.servers = [...state.servers, server]
  },
  setUserName: (state, userName: string) => {
    state.userName = userName
  },
  setRemoteUser: (state, userName?: string) => {
    state.remoteUserName = userName
  },
  ready: state => {
    state.ready = true
  },
  connect: state => {
    state.connected = true
  },
  disconnect: state => {
    state.server = null
    state.connected = false
  },
  startCall: state => {
    state.ongoing = true
  },
  endCall: state => {
    state.ongoing = false
    state.remoteUserName = undefined
  }
}
