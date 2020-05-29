<template lang="pug">
  q-page.q-pa-md
    div.row.justify-center.items-start.q-gutter-md
      q-card.text-center(v-if="ready && !ongoing && !local")
        q-card-section.text-h6
          div {{remoteId}}
          //- q-btn.col-6(v-if="!ongoing" @click="call") Call
      q-card.col-12.text-center
        video(v-if="ongoing" :srcObject.prop="remoteStream" autoplay controls)
        video.local(v-else :srcObject.prop="localStream" preload="true" :muted="!ongoing" autoplay)
        q-card-section.text-h6
          div(v-if="ongoing") {{remoteId}}
          div(v-else-if="local") You
        q-card-section(v-if="ongoing")
          q-btn.col-6(@click="end") End call
      q-card.col-4.text-center(v-if="ongoing")
        video.local(:srcObject.prop="localStream" preload="true" :muted="ongoing" autoplay)
        q-card-section.text-h6 You

</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from '@vue/composition-api'

import { getLocalStream, getRemoteStream } from 'src/store/peer'
import { startCamera } from 'src/common'

export default defineComponent({
  name: 'PageChat',
  setup(_, { root: { $store } }) {
    const local = computed<boolean>(() => $store.getters['chat/local'])
    const remoteId = computed<string>(
      () => $store.getters['chat/remoteUserName']
    )
    const ready = computed<boolean>(() => $store.getters['chat/ready'])
    const ongoing = computed<boolean>(() => $store.getters['chat/ongoing'])

    const localStream = ref<MediaStream | null>(getLocalStream())
    const remoteStream = computed(() => ongoing.value && getRemoteStream())

    // const call = () => $store.dispatch('chat/call')
    const end = () => $store.dispatch('chat/close')

    watch(
      () => $store.getters['chat/ready'],
      (ready: boolean) => {
        if (ready && !localStream.value)
          startCamera().then(stream => {
            localStream.value = stream
          })
      }
    )

    return {
      ready,
      ongoing,
      // call,
      end,
      local,
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
