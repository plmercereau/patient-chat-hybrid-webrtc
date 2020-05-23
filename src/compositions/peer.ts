import {
  getPeer,
  getLocalStream,
  getCallConnection,
  setCall
} from 'src/store/peer'
import { store } from 'src/store'

export const usePeer = () => {
  const peer = getPeer()

  const call = () => {
    console.log('call')
    setCall(peer.call(store.getters['chat/remoteUserName'], getLocalStream()))
  }

  const end = () => {
    getCallConnection().close()
  }

  const disconnect = () => {
    if (getCallConnection().open) end()
    peer.disconnect()
  }
  return {
    disconnect,
    call,
    end
  }
}
