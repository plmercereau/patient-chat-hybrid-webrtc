<template lang="pug">
  q-page.q-pa-md
    div.row.justify-center.items-start.q-gutter-md
      q-card(v-if="ready")
        q-card-section.row
          q-input.col-6(v-model="remoteId" name="remoteId" color="primary" label="Remote ID" clearable filled readonly)
          q-btn.col-6(v-if="!calling" @click="call") Call
          q-btn.col-6(v-if="calling" @click="end") End call
      q-card.col-12
        video(v-if="calling" :srcObject.prop="remoteStream" autoplay controls)
        video.local(v-else-if="local" :srcObject.prop="localStream" muted autoplay)
        q-card-section
          div.text-h6.text-center(v-if="calling") {{remoteId}}
          div.text-h6.text-center(v-else-if="local") You
      q-card.col-4(v-if="calling && local")
        video.local(:srcObject.prop="localStream" muted autoplay)
        q-card-section.text-h6.text-center You

</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted,
  onUnmounted
} from '@vue/composition-api'
import axios from 'axios'
import { usePeer } from 'src/compositions/peer'
import { getLocalStream, getRemoteStream } from 'src/store/peer'

export default defineComponent({
  name: 'PageChat',
  setup(_, { root: { $store } }) {
    const { disconnect, call, end } = usePeer()
    const local = computed<boolean>(() => $store.getters['chat/local'])
    const localId = computed<string>(() => $store.getters['chat/userName'])
    const remoteId = computed<string>(
      () => $store.getters['chat/remoteUserName']
    )
    const ready = computed<boolean>(() => $store.getters['chat/ready'])
    const connected = computed<boolean>(() => $store.getters['chat/connected'])
    const calling = computed<boolean>(() => $store.getters['chat/calling'])

    const localStream = computed(() => local.value && getLocalStream())
    const remoteStream = computed(() => calling.value && getRemoteStream())

    onMounted(async () => {
      await $store.dispatch('chat/startLocal')
    })
    onUnmounted(async () => {
      await $store.dispatch('chat/stopLocal')
    })

    // * Automatically starts the video call when someone else is connected to the same server
    const poll = setInterval(() => {
      // console.log('poll...')
      $store.getters['chat/url'] &&
        axios
          .get(`${$store.getters['chat/url']}/peerjs/peers`)
          .then(({ data }: { data: string[] }) => {
            // console.log(data)
            if (data.length > 1) {
              const remote = data.find(id => id !== localId.value)
              if (remote) {
                if (!calling.value) {
                  $store.commit('chat/setRemoteUser', remote)
                  call()
                }
                clearInterval(poll)
              }
            }
          })
          .catch(err => {
            console.log('ERROR IN POLLING')
            console.log(err)
            console.log(`${$store.getters['chat/url']}/peerjs/peers`)
          })
    }, 5000)

    return {
      ready,
      connected,
      calling,
      disconnect,
      call,
      end,
      local,
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
