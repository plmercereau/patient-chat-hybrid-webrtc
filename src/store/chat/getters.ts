import { GetterTree } from 'vuex'
import { State } from './state'
import { serverPath } from 'src/common/server'

export const getters: GetterTree<State, {}> = {
  server: state => state.server,
  url: ({ server }) => server && serverPath(server),
  servers: state => state.servers,
  userName: state => state.userName,
  remoteUserName: state => state.remoteUserName,
  ongoing: state => state.ongoing,
  ready: state => state.ready,
  connected: state => state.connected,
  local: (state, _, __, rootGetters) =>
    state.server &&
    (state.server.host === 'localhost' ||
      rootGetters['server/hostName'] === state.server.host)
}
