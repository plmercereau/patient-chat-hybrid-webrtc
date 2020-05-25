import { GetterTree } from 'vuex'
import { State } from './state'
import { SERVICE_PORT } from 'src/common'

export const getters: GetterTree<State, {}> = {
  hostName: state => state.hostName,
  starting: state => state.serverStatus === 'starting',
  ready: state => state.serverStatus === 'up',
  down: state => state.serverStatus === 'down',
  embedded: state => state.embedded,
  publicUrl: ({ hostName }, { ready }) =>
    ready && `http://${hostName}:${SERVICE_PORT}`,
  localConfig: state => ({
    name: state.hostName,
    host: 'localhost',
    port: SERVICE_PORT,
    secure: false
  })
}
