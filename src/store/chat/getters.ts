import { GetterTree } from 'vuex'
import { State } from './state'
import { serverPath } from 'src/common/server'

export const getters: GetterTree<State, {}> = {
  server: state => state.server,
  peerConfig: ({ server }) => {
    if (server) {
      if (process.env.DEV) {
        return {
          host: '/',
          port: location.port,
          path: `/servers/${server.host}/${server.port}`,
          secure: true,
          debug: 1
        }
      } else return server
    }
  },
  url: ({ server }) => server && serverPath(server),
  servers: state => state.servers,
  publicUrl: ({ server, hostName }) =>
    server &&
    `${server.secure ? 'https' : 'http'}://${hostName}:${server.port}`,
  hostName: state => state.hostName,
  userName: state => state.userName,
  remoteUserName: state => state.remoteUserName,
  calling: state => state.calling,
  ready: state => state.ready,
  connected: state => state.connected,
  local: state => state.local
}
