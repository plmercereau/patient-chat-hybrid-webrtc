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
  start: async ({ getters, commit, dispatch }) => {
    console.log('server/start')
    const hostName = await getHostName()
    commit('setHostName', hostName)
    // ? check is server is not already up and running ?
    if (getters['embedded']) {
      commit('starting')
      try {
        await startServer()
      } catch {
        // TODO most likely the server already started
        dispatch('ready')
      }
    } else {
      dispatch('ready')
    }
  },
  ready: async ({ getters, commit, dispatch }) => {
    console.log('server/ready')
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
      dispatch('chat/connect', undefined, { root: true })
    } else {
      console.error('Local server is not available') // TODO what then?
    }
  }
}
