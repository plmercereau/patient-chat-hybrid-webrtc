<template lang="pug">
  q-page.q-pa-md
    div IMEI..: {{imei}}
    div.row
      div.col-2 Your Id
      div.col-6 {{localId}}
    div.row
      div.col-2 Peer Id
      q-input.col-2(v-model="peerId")
      q-btn.col-2(@click="call") call
    div.row
      div.col-8
        video(:srcObject.prop="peerStream"
          autoplay="autoplay",
          class="center-block")
        div peer
      div.col-4
        video(:srcObject.prop="localStream"
          autoplay="autoplay",
          muted="true"
          class="center-block")
        div you
</template>

<script lang="ts">
// interface Navigator extends globalThis.Navigator {
//   mediaDevices: {
//     getUserMedia: (
//       constraints: MediaStreamConstraints,
//       successCallback: NavigatorUserMediaSuccessCallback,
//       errorCallback: NavigatorUserMediaErrorCallback
//     ) => void
//   }
// }
// declare const navigator: Navigator
interface Window extends globalThis.Window {
  device?: any
}
declare const window: Window

import { defineComponent, ref, computed } from '@vue/composition-api'
import Peer from 'peerjs'

export default defineComponent({
  name: 'PageChat',
  setup() {
    const localId = ref<string>('')
    const peerId = ref<string>('')
    const localStream = ref<MediaStream>(new MediaStream())
    const peerStream = ref<MediaStream>(new MediaStream())

    const peer = new Peer()
    peer.on('open', function() {
      console.log('open')
      localId.value = peer.id
    })

    peer.on('connection', function(connection) {
      console.log('connection')
      peerId.value = connection.peer
    })

    peer.on('error', function(err) {
      console.error('An error ocurred with peer: ' + err)
    })

    peer.on('call', function(call) {
      console.log('call')
      // var acceptsCall = confirm(
      //   'Videocall incoming, do you want to accept it ?'
      // )
      const acceptsCall = true
      if (acceptsCall) {
        // Answer the call with your own video/audio stream
        call.answer(localStream.value)

        // Receive data
        call.on('stream', function(stream) {
          peerStream.value = stream
        })

        // Handle when the call finishes
        call.on('close', function() {
          alert('The videocall has finished')
        })

        // use call.close() to finish a call
      } else {
        console.log('Call denied !')
      }
    })

    const call = () => {
      console.log('call')
      const callAction = peer.call(peerId.value, localStream.value)
      callAction.on('stream', function(stream) {
        peerStream.value = stream
      })
    }

    if (navigator.mediaDevices) {
      console.log('MEDIA DEVICES')
      console.log(Object.entries(navigator))
      console.info('TRY TRY TRY ===========================')
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            facingMode: 'environment' //'user'
          }
        })
        .then(media => {
          console.log('yeeha --------------!----------')
          //         const mediaControl = document.querySelector('video');
          // mediaControl.srcObject = mediaStream;
          // mediaControl.src = URL.createObjectURL(mediaStream);
          localStream.value = media
        })
    } else if (navigator.getUserMedia) {
      console.log('GET USER MEDIA')
      navigator.getUserMedia(
        { audio: true, video: true },
        function(stream) {
          console.log('HERE')
          // localStream.value = stream
          // onReceiveStream(stream, 'my-camera')
        },
        function(err) {
          alert('Cannot get access to your camera and video !')
          console.error(err)
        }
      )
    }

    const imei = computed(() => {
      return window.device === void 0
        ? 'Run this on a mobile/tablet device'
        : JSON.stringify(window.device)
    })
    // localStream.value = media
    return { localId, peerId, localStream, peerStream, call, imei }
  }
})
</script>
