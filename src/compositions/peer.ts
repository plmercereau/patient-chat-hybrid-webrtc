import { ref, Ref } from '@vue/composition-api'
import Peer from 'peerjs'

import { permissionsPlugin, PeerServer } from 'src/common'

const setLocalStream = (ls: Ref<MediaStream>) => {
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
        ls.value = media
      })
  }
}

const setHybridLocalStream = (ls: Ref<MediaStream>) => {
  if (permissionsPlugin) {
    const perms = [
      permissionsPlugin.MODIFY_AUDIO_SETTINGS,
      permissionsPlugin.RECORD_AUDIO,
      permissionsPlugin.CAPTURE_AUDIO_OUTPUT,
      permissionsPlugin.CAMERA
    ]

    permissionsPlugin.requestPermission(
      perms,
      () => setLocalStream(ls),
      () => console.log('FUNCKING NIGHTMARE')
    )
  } else {
    setLocalStream(ls)
  }
}

export const startPeer = (peerConfig: PeerServer) => {
  const ready = ref<boolean>(false)
  const connected = ref<boolean>(false)
  const calling = ref<boolean>(false)

  const localId = ref<string>()
  const localStream = ref<MediaStream>(new MediaStream())
  const remoteId = ref<string>('')
  const remoteStream = ref<MediaStream>(new MediaStream())

  const peer = new Peer(peerConfig)

  let callConnection: Peer.MediaConnection

  peer.on('open', () => {
    console.log('open')
    localId.value = peer.id
    ready.value = true
    setHybridLocalStream(localStream)
  })

  peer.on('connection', connection => {
    console.log('connection')
    remoteId.value = connection.peer
    connected.value = true
  })

  peer.on('error', err => {
    console.error('An error ocurred with peer: ' + err)
  })

  const setCall = (call: Peer.MediaConnection): void => {
    callConnection = call

    callConnection.on('stream', stream => {
      console.log('stream')
      remoteStream.value = stream
      calling.value = true
    })
    // Handle when the call finishes
    callConnection.on('close', () => {
      alert('The videocall has finished')
      calling.value = false
      //   remoteId.value = ''
      remoteStream.value = new MediaStream()
      connected.value = false
    })
  }

  peer.on('call', call => {
    console.log('on call')
    // var acceptsCall = confirm(
    //   'Videocall incoming, do you want to accept it ?'
    // )
    const acceptsCall = true
    if (acceptsCall) {
      // Answer the call with your own video/audio stream
      call.answer(localStream.value)
      remoteId.value = call.peer
      setCall(call)
      // use call.close() to finish a call
      calling.value = true
    } else {
      console.log('Call denied !')
    }
  })
  const call = () => {
    console.log('call')
    setCall(peer.call(remoteId.value, localStream.value))
  }

  const end = () => {
    console.log('end call')
    callConnection.close()
  }

  peer.on('disconnected', () => {
    connected.value = false
  })

  const disconnect = () => {
    if (callConnection.open) end()
    peer.disconnect()
  }
  return {
    ready,
    connected,
    calling,
    disconnect,
    call,
    end,
    localId,
    localStream,
    remoteId,
    remoteStream
  }
}
