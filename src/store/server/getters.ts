import { GetterTree } from 'vuex'
import { State } from './state'
import { SERVICE_PORT } from 'src/common'

export const getters: GetterTree<State, {}> = {
  hostName: state => state.hostName,
  starting: state => state.embedded && state.serverStatus === 'starting',
  ready: state => !state.embedded || state.serverStatus === 'up',
  down: state => state.embedded && state.serverStatus === 'down',
  embedded: state => state.embedded,
  publicUrl: ({ hostName }, { ready }) =>
    ready && `http://${hostName}:${SERVICE_PORT}`
}
