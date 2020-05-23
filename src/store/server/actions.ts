import { State } from './state'
import { ActionTree } from 'Vuex'
import {
  SERVICE_PORT,
  startServer,
  getHostName,
  register,
  SERVICE_NAME
} from 'src/common'

export const actions: ActionTree<State, {}> = {
  start: async ({ commit, state }) => {
    // ? check is server is not already up and running
    if (state.canRun) {
      const hostName = await getHostName()
      commit('chat/setHostName', hostName, { root: true })
      commit('starting')
      await startServer()
      commit(
        'chat/setServer',
        {
          name: hostName,
          host: 'localhost',
          port: SERVICE_PORT,
          secure: false
        },
        { root: true }
      )
      commit('ready')
      try {
        register('_http._tcp.', 'local.', hostName, SERVICE_PORT, {
          name: SERVICE_NAME
        })
      } catch (error) {
        console.log('Impossible to register the service')
      }
    }
  }
}
