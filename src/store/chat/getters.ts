import { GetterTree } from 'vuex'
import { State } from './state'
import { serverPath } from 'src/common/server'
import { PeerServer } from 'src/common/types'

export const peerConfig = (server: PeerServer): PeerServer => {
  if (process.env.DEV) {
    return {
      host: '/',
      port: parseInt(location.port),
      path: `/servers/${server.host}/${server.port}`,
      secure: true,
      debug: 1
    }
  } else return server
}

export const getters: GetterTree<State, {}> = {
  server: state => state.server,
  peerConfig: ({ server }) => server && peerConfig(server),
  url: ({ server }) => server && serverPath(server),
  servers: state => state.servers,
  userName: state => state.userName,
  remoteUserName: state => state.remoteUserName,
  calling: state => state.calling,
  ready: state => state.ready,
  connected: state => state.connected,
  local: state => state.server && state.server.host === 'localhost'
}
