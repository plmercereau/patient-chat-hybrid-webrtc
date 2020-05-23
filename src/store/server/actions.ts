import { State } from './state'
import { ActionTree } from 'Vuex'
import {
  SERVICE_PORT,
  startServer,
  getHostname,
  register,
  SERVICE_NAME
} from 'src/common'
import { Platform } from 'quasar'

export const actions: ActionTree<State, {}> = {
  start: async ({ commit, state }) => {
    // ? check is server is not already up and running
    if (!!Platform.is.cordova && state.runServer) {
      const hostname = await getHostname()
      commit('chat/setHostname', hostname, { root: true })
      commit('starting')
      await startServer()
      commit(
        'chat/setServer',
        {
          name: hostname,
          host: 'localhost',
          port: SERVICE_PORT,
          secure: false
        },
        { root: true }
      )
      commit('ready')
      try {
        register('_http._tcp.', 'local.', hostname, SERVICE_PORT, {
          name: SERVICE_NAME
        })
      } catch (error) {
        console.log('Impossible to register the service')
      }
    }
  }
}
