import { State } from './state'
import { ActionTree } from 'Vuex'
import { watch, startCamera } from 'src/common'
import { isValid } from 'src/common/server'
import { Platform } from 'quasar'
import { PeerServer } from 'src/common/types'
import {
  createPeer,
  getLocalStream,
  setCall,
  getPeer,
  getCallConnection
} from '../peer'
import axios from 'axios'

export const actions: ActionTree<State, {}> = {
  load: async ({ dispatch, state, commit, rootGetters }) => {
    console.log('load')
    await dispatch('server/start', undefined, { root: true })

    const hostName = rootGetters['server/hostName']
    // ? As an initial state / getter in the store?
    if (!state.userName) {
      commit(
        'setUserName',
        Platform.is.cordova
          ? hostName
          : Math.random()
              .toString(36)
              .substring(7)
      )
    }

    // * Connect to local peer server
    await dispatch('localConnect')
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
    })
  },
  // * Connect to the local PeerJS server
  localConnect: async ({ dispatch, getters }) => {
    console.log('start local')
    if (!getters['local']) {
      await dispatch('connect')
    }
  },

  call: async ({ commit, getters, rootGetters }) => {
    try {
      const { data }: { data: string[] } = await axios.get(
        `${getters.url}/peerjs/peers`
      )
      const remote = data.find(id => id !== getters.userName)
      if (remote) {
        if (!getters.calling) {
          commit('setRemoteUser', remote)
          const localStream = getLocalStream() || (await startCamera())
          setCall(getPeer().call(remote, localStream))
        }
      }
    } catch (err) {
      console.log('ERROR CONNECTING THE PEER SERVER')
      console.log(err)
      console.log(`${rootGetters['chat/url']}/peerjs/peers`)
    }
  },

  endCall: ({ commit }) => {
    const connection = getCallConnection()
    if (connection.open) getCallConnection().close()
    commit('endCall')
  },

  // * Disconnect from the current PeerJS server
  disconnect: ({ commit, getters, dispatch }) => {
    if (getters['calling']) {
      dispatch('endCall')
    }
    if (getters['connected']) {
      const peer = getPeer()
      if (peer) peer.disconnect()
      commit('disconnect')
    }
  },

  // * Connect to the given PeerJS server, or the local server if none given
  connect: async (
    { state, commit, dispatch, rootGetters, getters },
    server?: PeerServer
  ) => {
    const local = !server
    const config: PeerServer = local
      ? rootGetters['server/localConfig']
      : (server as PeerServer)

    if (config !== state.server) {
      // TODO check if it works
      console.log('new server')
      dispatch('disconnect')
    }

    commit('setServer', config)
    const peer = createPeer(state.userName, getters['peerConfig'])

    peer.on('open', () => {
      console.log('open')
      commit('setUserName', peer.id)
      commit('ready')
    })

    peer.on('connection', connection => {
      console.log('peer connection')
      commit('setRemoteUser', connection.peer) // TODODODODODODODODOODODODOOD
      commit('connect')
    })

    peer.on('error', err => {
      console.error('An error ocurred with peer: ' + err)
    })

    peer.on('call', call => {
      console.log('Call from a peer')
      // var acceptsCall = confirm(
      //   'Videocall incoming, do you want to accept it ?'
      // )
      if (state.autoAnswer) {
        startCamera().then(stream => {
          call.answer(stream)
          commit('setRemoteUser', call.peer)
          setCall(call)
        }) // TODO
      } else {
        console.log('Call denied !')
      }
    })

    peer.on('disconnected', () => {
      dispatch('disconnect')
    })

    if (local) {
      console.log('What do we have to do here?') // TODO
    }
    if (state.autoCall) {
      // * If 2 peers connected to the server, then start a call
      await dispatch('call')
    }
  }
}
