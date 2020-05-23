import { GetterTree } from 'vuex'
import { State } from './state'

export const getters: GetterTree<State, {}> = {
  server: state => state.server,
  url: ({ server }) =>
    server &&
    `${server.secure ? 'https' : 'http'}://${server.host}:${server.port}`,
  servers: state => state.servers,
  publicUrl: ({ server, hostName }) =>
    server &&
    `${server.secure ? 'https' : 'http'}://${hostName}:${server.port}`,
  hostName: state => state.hostName,
  userName: state => state.userName,
  remoteUserName: state => state.remoteUserName
}
