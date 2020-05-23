import { State } from './state'
import { ActionTree } from 'Vuex'
import { checkServer, watch } from 'src/common'
import { isValid } from 'src/common/server'

export const actions: ActionTree<State, {}> = {
  load: async ({ dispatch, state }) => {
    if (!state.server || !(await checkServer(state.server))) {
      dispatch('selectFirstUp')
    }
  },
  selectFirstUp: () => {
    // TODO Finish this
    // let watching = true
    console.log('SELECT FIRST UP')
    watch(result => {
      console.log(result) // TODO remove!!
      // TODO check if the result is a chat service. If it is, commit the server and stop watching (watching = false + unwatch)
      // TODO select first one that actually answers to an health check
      // const server = { host: 'localhost', port: SERVICE_PORT, secure: false }
      // if (await checkServer(server)) {
      //   console.log('SERVER IS UP!!!')
      //   commit('setServer', server)
      // }
    })

    // setTimeout(() => {
    //   console.log('SELECT FIRST UP: UNWATCH')
    //   unwatch().then(() => {
    //     if (watching) {
    //       watching = false
    //       console.log('SELECT FIRST UP: WATCHING STOPPED. NOTHING FOUND')
    //       // ??? Automatic start ???
    //     }
    //   })
    // }, 5000)
  },
  // TODO add unwatch servers as well
  watchServers: ({ commit }) => {
    console.log('WATCH SERVERS') // TODO REMOVE
    watch(({ action, service }) => {
      console.log(`WATCH SERVERS: FOUND ${JSON.stringify(service)}`)
      if (action === 'resolved' && isValid(service)) {
        commit('addServer', {
          name: service.name,
          host: service.hostname || service.ipv4Addresses[0],
          port: service.port,
          secure: false
        })
      }
    }) // TODO TRANSFORM AND MUTATE
    // state.servers = list
    //   .filter(
    //     service =>
    //       service.txtRecord.name === SERVICE_NAME &&
    //       service.port === SERVICE_PORT
    //   )
    //   .map(service => ({
    //     host: JSON.stringify(service),
    //     port: service.port,
    //     secure: false
    //   }))
  }
}
