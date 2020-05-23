import { State } from './state'
import { ActionTree } from 'Vuex'
import { checkServer, watch, getHostName, permissionsPlugin } from 'src/common'
import { isValid } from 'src/common/server'
import { Platform } from 'quasar'
import { PeerServer } from 'src/common/types'
import { createPeer, setLocalStream, getLocalStream, setCall } from '../peer'

// ? Move elsewhere?
const WEB_SERVER: PeerServer = {
  name: 'Local server',
  host: 'localhost',
  port: 3000,
  secure: false
}

// ? Move elsewhere?
const setNavLocalStream = () => {
  if (navigator.mediaDevices) {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          facingMode: 'user' // 'environment'
        }
      })
      .then(media => {
        console.log('SET LOCAL STREAM')
        setLocalStream(media)
      })
  }
}

// ? Move elsewhere?
const setHybridLocalStream = () => {
  if (permissionsPlugin) {
    const perms = [
      permissionsPlugin.MODIFY_AUDIO_SETTINGS,
      permissionsPlugin.RECORD_AUDIO,
      permissionsPlugin.CAPTURE_AUDIO_OUTPUT,
      permissionsPlugin.CAMERA
    ]

    permissionsPlugin.requestPermission(
      perms,
      () => setNavLocalStream(),
      () => console.log('FUNCKING NIGHTMARE')
    )
  } else {
    setNavLocalStream()
  }
}

export const actions: ActionTree<State, {}> = {
  load: async ({ dispatch, state, commit }) => {
    // Check if a server has been already set, and is up and running
    if (!state.server || !(await checkServer(state.server))) {
      // If not, and running on cordova/android, look for one
      if (Platform.is.cordova) {
        dispatch('selectFirstUp')
      } else if (await checkServer(WEB_SERVER)) commit('setServer', WEB_SERVER) // If running the web app, check if a local server is available
    }
    if (!state.userName) {
      commit(
        'setUserName',
        Platform.is.cordova
          ? await getHostName()
          : Math.random()
              .toString(36)
              .substring(7)
      )
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
  },
  startPeerClient: ({ state, commit }) => {
    if (state.server) {
      console.log('Creating PeerJS client...')
      const peer = createPeer(state.userName, state.server)
      peer.on('open', () => {
        console.log('open')
        commit('setUserName', peer.id)
        commit('ready')
        setHybridLocalStream()
      })

      peer.on('connection', connection => {
        console.log('connection')
        commit('setRemoteUser', connection.peer) // TODODODODODODODODOODODODOOD
        commit('connected')
      })

      peer.on('error', err => {
        console.error('An error ocurred with peer: ' + err)
      })

      peer.on('call', call => {
        console.log('on call')
        // var acceptsCall = confirm(
        //   'Videocall incoming, do you want to accept it ?'
        // )
        const acceptsCall = true
        if (acceptsCall) {
          // Answer the call with your own video/audio stream
          call.answer(getLocalStream())
          commit('setRemoteUser', call.peer)
          commit('callStart')
          setCall(call)
        } else {
          console.log('Call denied !')
        }
      })

      peer.on('disconnected', () => commit('disconnected'))
    }
  }
}
