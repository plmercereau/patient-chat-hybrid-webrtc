import { MutationTree } from 'vuex'
import { State } from './state'

export const mutations: MutationTree<State> = {
  starting: state => {
    state.serverStatus = 'starting'
  },
  ready: state => {
    state.serverStatus = 'up'
  }
}
