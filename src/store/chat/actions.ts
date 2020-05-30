import { State } from './state'
import { ActionTree } from 'Vuex'
import { watch, startCamera, getHostName, stopCamera } from 'src/common'
import { isValid, SERVICE_PORT } from 'src/common/server'
import { Platform } from 'quasar'
import { PeerServer } from 'src/common/types'
import { createPeer, setCall, getPeer, getCallConnection } from '../peer'
import axios from 'axios'

export const actions: ActionTree<State, {}> = {
  load: async ({ dispatch, commit, rootGetters, getters }) => {
    console.log('chat/load')
    await dispatch('server/start', undefined, { root: true })

    const hostName = rootGetters['server/hostName']
    // ? As an initial state / getter in the store?
    if (!getters['userName']) {
      commit(
        'setUserName',
        Platform.is.cordova
          ? hostName
          : Math.random()
              .toString(36)
              .substring(7)
      )
    }

    dispatch('watchServers')
  },
  selectFirstUp: () => {
    // TODO Finish this
    // let watching = true
    console.log('chat/selectFirstUp')
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
  // ? add 'unwatch' as well ?
  // TODO watch any event and update existing records
  watchServers: ({ commit, rootGetters }) => {
    watch(({ action, service }) => {
      console.log(action)
      if (
        action === 'resolved' &&
        isValid(service) &&
        service.name !== rootGetters['server/hostName']
      ) {
        commit('addServer', {
          name: service.name,
          host: service.hostname || service.ipv4Addresses[0],
          port: service.port,
          secure: false
        })
      }
    })
  },

  call: async ({ commit, getters }) => {
    console.log('chat/call')
    try {
      const { data }: { data: string[] } = await axios.get(
        `${getters['url']}/peerjs/peers`
      )
      const remote = data.find(id => id !== getters['userName'])
      if (remote) {
        if (!getters['ongoing']) {
          commit('setRemoteUser', remote)
          const localStream = await startCamera()
          setCall(getPeer().call(remote, localStream))
        }
      }
    } catch (err) {
      console.log(err)
    }
  },

  endCall: ({ commit }) => {
    console.log('chat/endCall')
    stopCamera()
    const connection = getCallConnection()
    if (connection && connection.open) connection.close()
    commit('endCall')
  },

  close: ({ dispatch, commit, getters }) => {
    console.log('chat/close')
    dispatch('endCall')
    commit('disconnect')
    if (!getters['local']) {
      const peer = getPeer()
      if (peer) peer.destroy()
    }
  },
  // * Connect to the given PeerJS server, or the local server if none given
  connect: async ({ state, commit, dispatch }, newServer?: PeerServer) => {
    console.log('chat/connect')
    dispatch('close')

    const local = !newServer
    if (!newServer)
      newServer = {
        name: await getHostName(),
        host: await getHostName(),
        port: SERVICE_PORT,
        secure: false
      }

    const peer = createPeer(newServer)

    peer.on('open', () => {
      console.log('peer: on open')
      commit('setUserName', peer.id)
      commit('ready')
    })

    peer.on('connection', connection => {
      // ? Not really used until now. We'll maybe need to implement this for adequate 'disconnection' event
      console.log('peer: on connection')
      commit('setRemoteUser', connection.peer)
      commit('connect')
    })

    peer.on('error', err => {
      console.log('peer: on error')
      console.error('An error ocurred with peer: ' + err)
    })

    peer.on('call', call => {
      console.log('peer: on call')
      // var acceptsCall = confirm(
      //   'Videocall incoming, do you want to accept it ?'
      // )
      if (state.autoAnswer) {
        startCamera().then(localStream => {
          call.answer(localStream)
          commit('setRemoteUser', call.peer)
          setCall(call)
        }) // TODO
      } else {
        console.log('Call denied !')
      }
    })

    // peer.on('disconnect', () => {
    //   console.log('peer: on disconnect')
    // })

    peer.on('close', () => {
      console.log('peer: on close. Do nothing.')
    })

    if (!local && state.autoCall) {
      // * If 2 peers connected to the server, then start a call
      await dispatch('call')
    }
  }
}
