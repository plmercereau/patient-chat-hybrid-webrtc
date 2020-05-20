<template lang="pug">
  q-page.q-pa-md
    div.row.justify-center.items-start.q-gutter-md
      q-card
        q-card-section.row
          q-input.col-5(v-model="localId" name="localId" color="primary" label="Your ID"  filled readonly)
          q-input.col-5(v-model="peerId" name="peerId" color="primary" label="Peer ID" clearable filled :readonly="calling")
          div.col-2(v-if="calling") Ongoing call
          q-btn.col-2(v-if="!calling" @click="call") call
          q-btn.col-2(v-if="calling" @click="endCall") End call
      q-card.col-12
        video(v-if="calling" :srcObject.prop="peerStream"
          autoplay="autoplay")
        video(v-else :srcObject.prop="localStream" muted="true"
          autoplay="autoplay")
        q-card-section
          div.text-h6(v-if="calling") {{peerId}}
          div.text-h6(v-else) You
      q-card.col-2(v-if="calling")
        video(:srcObject.prop="localStream" muted="true"
          autoplay="autoplay")
        q-card-section.text-h6 You

</template>

<script lang="ts">
import permissionsPlugin from 'components/permissions-plugin'

interface Window extends globalThis.Window {
  device?: any
}
declare const window: Window

import { defineComponent, ref, computed } from '@vue/composition-api'
import Peer from 'peerjs'
import { Platform } from 'quasar'

export default defineComponent({
  name: 'PageChat',
  setup() {
    const localId = ref<string>('')
    const peerId = ref<string>('')
    const localStream = ref<MediaStream>(new MediaStream())
    const peerStream = ref<MediaStream>(new MediaStream())
    const peer = new Peer()
    let callConnection: Peer.MediaConnection

    const calling = ref<boolean>(false)
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

    const setCall = (call: Peer.MediaConnection): void => {
      callConnection = call

      callConnection.on('stream', function(stream) {
        peerStream.value = stream
        calling.value = true
      })
      // Handle when the call finishes
      callConnection.on('close', function() {
        alert('The videocall has finished')
        calling.value = false
        peerId.value = ''
      })
    }

    peer.on('call', function(call) {
      console.log('on call')
      // var acceptsCall = confirm(
      //   'Videocall incoming, do you want to accept it ?'
      // )
      const acceptsCall = true
      if (acceptsCall) {
        // Answer the call with your own video/audio stream
        call.answer(localStream.value)
        peerId.value = call.peer
        setCall(call)
        // use call.close() to finish a call
      } else {
        console.log('Call denied !')
      }
    })

    const call = () => {
      console.log('call')
      setCall(peer.call(peerId.value, localStream.value))
    }

    const endCall = () => {
      console.log('end call')
      callConnection.close()
      calling.value = false
    }

    const setLocalStream = () => {
      if (navigator.mediaDevices) {
        navigator.mediaDevices
          .getUserMedia({
            audio: true,
            video: {
              facingMode: 'user' // 'environment'
            }
          })
          .then(media => {
            localStream.value = media
          })
      }
    }
    if (Platform.is.cordova) {
      const perms = [
        permissionsPlugin.MODIFY_AUDIO_SETTINGS,
        permissionsPlugin.RECORD_AUDIO,
        permissionsPlugin.CAPTURE_AUDIO_OUTPUT,
        permissionsPlugin.CAMERA
      ]

      permissionsPlugin.requestPermission(
        perms,
        () => setLocalStream(),
        () => console.log('FUNCKING NIGHTMARE')
      )
    } else {
      setLocalStream()
    }

    const imei = computed(() => {
      return window.device === void 0
        ? 'Run this on a mobile/tablet device'
        : JSON.stringify(window.device)
    })

    return {
      localId,
      peerId,
      localStream,
      peerStream,
      call,
      endCall,
      imei,
      calling
    }
  }
})
</script>
<style scoped>
video {
  /* override other styles to make responsive */
  width: 100% !important;
  height: auto !important;
}
</style>
