import { State } from './state'
import { ActionTree } from 'Vuex'
import {
  checkServer,
  SERVICE_PORT,
  startServer,
  getHostname,
  register,
  watch,
  SERVICE_NAME
} from 'src/common'
import { Platform } from 'quasar'

export const actions: ActionTree<State, {}> = {
  load: {
    handler: async ({ dispatch, commit, state }) => {
      const hostname = await getHostname()
      commit('setHostname', hostname)
      if (state.server && (await checkServer(state.server))) {
        console.log('INITIAL STATE SERVER FOUND') // TODO remove
        console.log(state.server) // TODO remove
      } else {
        await dispatch('selectFirstUp')
        if (!state.server && !!Platform.is.cordova && state.runServer) {
          await startServer()
          commit('setServer', {
            host: 'localhost',
            port: SERVICE_PORT,
            secure: false
          })
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
  },
  selectFirstUp: {
    // TODO review this
    handler: async ({ commit }) => {
      const list = await watch('_http._tcp.', 'local.') // TODO remove!!
      // TODO select first one that actually answers to an health check
      const server = { host: 'localhost', port: SERVICE_PORT, secure: false }
      if (await checkServer(server)) {
        console.log('SERVER IS UP!!!')
        commit('setServer', server)
      }
    }
  },
  listServers: {
    handler: async ({ state }) => {
      console.log('LIST NDNS SERVERS') // TODO REMOVE
      const list = await watch('_http._tcp.', 'local.', 20000) // TODO TRANSFORM AND MUTATE
      state.servers = list // TODO commit list
        .filter(
          service =>
            service.txtRecord.name === SERVICE_NAME &&
            service.port === SERVICE_PORT
        )
        .map(service => ({
          host: JSON.stringify(service),
          port: service.port,
          secure: false
        }))
      console.log(`SERVER LIST: ${JSON.stringify(list)}`) // TODO remove
    }
  }
}
