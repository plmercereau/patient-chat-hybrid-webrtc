import { MutationTree } from 'vuex'
import { State } from './state'
import { PeerServer } from 'src/common'
import { LocalStorage } from 'quasar'

export const mutations: MutationTree<State> = {
  setHostname(state, hostname: string) {
    state.hostname = hostname
  },
  setServer(state, server: PeerServer) {
    state.server = server
    LocalStorage.set('server', server)
  },
  addServer(state, ...servers: PeerServer[]) {
    state.servers.push(...servers)
  }
}
