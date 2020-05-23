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
  setHostname: (state, hostname: string) => {
    state.hostname = hostname
  }
}
