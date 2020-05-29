// TODO move outside of the store folder!

import Peer from 'peerjs'
import { store } from '.'
import { PeerServer } from 'src/common/types'
let peer: Peer

const peerConfig = (server: PeerServer): Peer.PeerJSOption => {
  if (process.env.DEV) {
    return {
      host: '/',
      port: parseInt(location.port),
      path: `/servers/${server.host}/${server.port}`,
      secure: true,
      debug: 1
    }
  } else return server
}

export const createPeer = (server: PeerServer) => {
  const config = peerConfig(server)
  peer = new Peer(store.getters['chat/userName'], config)
  store.commit('chat/setServer', server)
  return peer
}

export const getPeer = () => peer

let localStream: MediaStream | null = null //= new MediaStream()
export const getLocalStream = () => localStream
export const setLocalStream = (stream: MediaStream) => {
  localStream = stream
}

let remoteStream: MediaStream | null = null //= new MediaStream()
export const getRemoteStream = () => remoteStream
export const setRemoteStream = (stream: MediaStream | null) => {
  remoteStream = stream
}

let callConnection: Peer.MediaConnection | null = null
export const getCallConnection = () => callConnection
export const setCallConnection = (conn: Peer.MediaConnection) => {
  callConnection = conn
}

export const setCall = (call: Peer.MediaConnection): void => {
  setCallConnection(call)

  call.on('stream', stream => {
    // TODO why is it called twice?
    console.log('call: on stream')
    setRemoteStream(stream)
    store.commit('chat/startCall')
  })
  // Handle when the call finishes
  call.on('close', () => {
    console.log('call: on close')
    setRemoteStream(null)
    if (!store.getters['local']) {
      store.dispatch('chat/connect')
    }
  })
}
