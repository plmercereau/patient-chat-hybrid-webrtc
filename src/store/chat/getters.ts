import { GetterTree } from 'vuex'
import { State } from './state'

export const getters: GetterTree<State, {}> = {
  peerjs: state => state.server,
  url: ({ server }) =>
    server &&
    `${server.secure ? 'https' : 'http'}://${server.host}:${server.port}`
}
