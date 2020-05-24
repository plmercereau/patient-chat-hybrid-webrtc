<template lang="pug">
  q-page.q-pa-md
    div.row.justify-center.items-start.q-gutter-md
      q-card(v-if="ready")
        q-card-section.row
          q-input.col-5(v-model="localId" name="localId" color="primary" label="Your ID"  filled readonly)
          q-input.col-5(v-model="remoteId" name="remoteId" color="primary" label="Remote ID" clearable filled :readonly="calling")
          div.col-2(v-if="calling") Ongoing call
          q-btn.col-2(v-if="!calling" @click="call") call
          q-btn.col-2(v-if="calling" @click="end") End call
      q-card.col-12
        video(v-if="calling" :srcObject.prop="remoteStream" autoplay controls)
        video.local(v-else :srcObject.prop="localStream" muted autoplay)
        q-card-section
          div.text-h6(v-if="calling") {{remoteId}}
          div.text-h6(v-else) You: {{localId}}
      q-card.col-2(v-if="calling")
        video.local(:srcObject.prop="localStream" muted autoplay)
        q-card-section.text-h6 You: {{localId}}

</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from '@vue/composition-api'
import { store } from 'src/store'
import axios from 'axios'
import { usePeer } from 'src/compositions/peer'
import { getLocalStream, getRemoteStream } from '../store/peer'
import { startCamera } from '../common/media'
export default defineComponent({
  name: 'PageChat',
  setup() {
    // const peerConfig = store.getters['chat/server']
    const { disconnect, call, end } = usePeer()
    const localId = computed<string>(() => store.getters['chat/userName'])
    const remoteId = computed<string>(
      () => store.getters['chat/remoteUserName']
    )
    const ready = computed<boolean>(() => store.getters['chat/ready'])
    const connected = computed<boolean>(() => store.getters['chat/connected'])
    const calling = computed<boolean>(() => store.getters['chat/calling'])
    // const localStream = ref<MediaStream>()
    // startCamera().then(() => (localStream.value = getLocalStream()))

    onMounted(async () => {
      await startCamera()
      // localStream.value = getLocalStream()
    })

    const localStream = computed(() => getLocalStream())
    const remoteStream = computed(() => getRemoteStream())
    // * Automatically starts the video call when someone else is connected to the same server
    const poll = setInterval(() => {
      // console.log('poll...')
      store.getters['chat/url'] &&
        axios
          .get(`${store.getters['chat/url']}/peerjs/peers`)
          .then(({ data }: { data: string[] }) => {
            // console.log(data)
            if (data.length > 1) {
              const remote = data.find(id => id !== localId.value)
              if (remote) {
                if (!calling.value) {
                  store.commit('chat/setRemoteUser', remote)
                  call()
                }
                clearInterval(poll)
              }
            }
          })
          .catch(err => {
            console.log('ERROR IN POLLING')
            console.log(err)
            console.log(`${store.getters['chat/url']}/peerjs/peers`)
          })
    }, 5000)

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
})
</script>
<style scoped>
video {
  /* override other styles to make responsive */
  width: 100% !important;
  height: auto !important;
}
video.local {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}
</style>
