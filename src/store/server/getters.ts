import { GetterTree } from 'vuex'
import { State } from './state'

export const getters: GetterTree<State, {}> = {
  starting: state => state.serverStatus === 'starting',
  ready: state => state.serverStatus === 'up',
  canRun: state => state.canRun
}
