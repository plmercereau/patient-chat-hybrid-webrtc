import { MutationTree } from 'vuex'
import { State } from './state'

export const mutations: MutationTree<State> = {
  setHostName: (state, hostName: string) => {
    state.hostName = hostName
  },
  starting: state => {
    state.serverStatus = 'starting'
  },
  ready: state => {
    state.serverStatus = 'up'
  }
}
