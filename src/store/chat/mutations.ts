import { MutationTree } from 'vuex'
import { State } from './state'
import { PeerServer } from 'src/common/types'
import { LocalStorage } from 'quasar'

export const mutations: MutationTree<State> = {
  setHostname(state, hostname: string) {
    state.hostname = hostname
  },
  setServer(state, server: PeerServer) {
    console.log('COMMITING SERVER STATE...')
    state.server = server
    LocalStorage.set('server', server)
    console.log('COMMIT SERVER STATE DONE!')
  },
  addServer(state, ...servers: PeerServer[]) {
    state.servers.push(...servers)
  }
}
