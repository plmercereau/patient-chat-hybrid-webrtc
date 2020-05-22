import { State } from './state'
import { ActionTree } from 'Vuex'
import {
  checkServer,
  SERVICE_PORT,
  startServer,
  getHostname,
  register,
  watch
} from 'src/common'

export const actions: ActionTree<State, {}> = {
  load: {
    handler: async ({ dispatch, commit, state }) => {
      const hostname = await getHostname()
      commit('setHostname', hostname)
      if (state.runServer) {
        console.log('START SERVER') // TODO remove
        await startServer()
        try {
          register('_http._tcp.', 'local.', hostname, SERVICE_PORT, {})
        } catch (error) {
          console.log('Impossible to register the service')
        }
      }
      if (state.server) {
        console.log(state.server)
        console.log('INITIAL SERVER FOUND. CHECK IF UP') // TODO remove
        if (!(await checkServer(state.server))) {
          console.log('SERVER IS DOWN') // TODO remove
          await dispatch('selectFirstUp')
        }
      } else {
        console.log('NO INITIAL SERVER') // TODO remove
        await dispatch('selectFirstUp')
      }
    }
  },
  selectFirstUp: {
    handler: async ({ commit }) => {
      console.log('LIST SERVERS') // TODO REMOVE
      const list = await watch('_http._tcp', 'local.', 3000) // TODO remove!!
      console.log(`SERVER LIST: ${JSON.stringify(list)}`) // TODO remove !!!
      commit('setServer', { host: 'localhost', port: 3000, secure: false }) // TODO revoir
    }
  },
  listServers: {
    handler: async () => {
      console.log('LIST SERVERS') // TODO REMOVE
      const list = await watch('_http._tcp', 'local.', 3000) // TODO TRANSFORM AND MUTATE
      console.log(`SERVER LIST: ${JSON.stringify(list)}`) // TODO remove
    }
  }
}
