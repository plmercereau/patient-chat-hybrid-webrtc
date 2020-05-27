import { State } from './state'
import { ActionTree } from 'Vuex'
import {
  SERVICE_PORT,
  startServer,
  register,
  SERVICE_NAME,
  getHostName,
  checkServer
} from 'src/common'

export const actions: ActionTree<State, {}> = {
  start: async ({ getters, commit }) => {
    const hostName = await getHostName()
    commit('setHostName', hostName)
    // ? check is server is not already up and running ?
    if (getters['embedded']) {
      commit('starting')
      await startServer()
    }
  },
  ready: async ({ getters, commit }) => {
    if (getters['embedded']) {
      try {
        // TODO move to Express
        await register(
          '_http._tcp.',
          'local.',
          getters['hostName'],
          SERVICE_PORT,
          {
            name: SERVICE_NAME
          }
        )
      } catch (error) {
        console.log('Impossible to register the service')
      }
    }
    if (
      await checkServer({
        host: 'localhost',
        port: SERVICE_PORT,
        secure: false
      })
    ) {
      commit('ready')
    } else {
      console.error('Local server is not available') // TODO what then?
    }
  }
}
