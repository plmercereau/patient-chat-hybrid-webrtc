// TODO move outside of the store folder!

import Peer from 'peerjs'
import { store } from '.'
let peer: Peer

export const createPeer = (
  id: string | undefined,
  peerConfig: Peer.PeerJSOption
) => {
  peer = new Peer(id, peerConfig)
  return peer
}

export const getPeer = () => peer

let localStream: MediaStream // = new MediaStream()
export const getLocalStream = () => localStream
export const setLocalStream = (stream: MediaStream) => {
  localStream = stream
}

let remoteStream: MediaStream //= new MediaStream()
export const getRemoteStream = () => remoteStream
export const setRemoteStream = (stream: MediaStream) => {
  remoteStream = stream
}

let callConnection: Peer.MediaConnection
export const getCallConnection = () => callConnection
export const setCallConnection = (conn: Peer.MediaConnection) => {
  callConnection = conn
}

export const setCall = (call: Peer.MediaConnection): void => {
  setCallConnection(call)

  call.on('stream', stream => {
    // TODO why is it called twice?
    console.log('stream')
    setRemoteStream(stream)
    store.commit('chat/callStart')
  })
  // Handle when the call finishes
  call.on('close', () => {
    alert('The videocall has finished')
    store.commit('chat/callEnd')
    store.commit('chat/disconnected')
    setRemoteStream(new MediaStream())
  })
}
