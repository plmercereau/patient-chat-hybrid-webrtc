import { GetterTree } from 'vuex'
import { State } from './state'

export const getters: GetterTree<State, {}> = {
  server: state => state.server,
  url: ({ server }) =>
    server &&
    `${server.secure ? 'https' : 'http'}://${server.host}:${server.port}`,
  servers: state => state.servers,
  publicUrl: ({ server, hostname }) =>
    server &&
    `${server.secure ? 'https' : 'http'}://${hostname}:${server.port}`,
  hostname: state => state.hostname
}
