import { GetterTree } from 'vuex'
import { State } from './state'
import { serverPath } from 'src/common/server'

export const getters: GetterTree<State, {}> = {
  server: state => state.server,
  url: ({ server }) => server && serverPath(server),
  servers: state => state.servers,
  userName: state => state.userName,
  remoteUserName: state => state.remoteUserName,
  calling: state => state.calling,
  ready: state => state.ready,
  connected: state => state.connected,
  local: state => state.server && state.server.host === 'localhost'
}
