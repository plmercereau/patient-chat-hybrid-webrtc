<template lang="pug">
  q-page.q-pa-md
    div.row.justify-center.items-start.q-gutter-md(v-if="ongoing")
      q-card.col-12.text-center
        video(:srcObject.prop="remoteStream" autoplay controls)
        q-card-section.text-h6 {{remoteId}}
        q-card-section
          q-btn.col-6(@click="end") End call
      //- q-card.col-4.text-center
        video.local(ref="localVideo" :srcObject.prop="localStream" autoplay muted="muted" onloadedmetadata="this.muted = true")
        q-card-section.text-h6 You

</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from '@vue/composition-api'

import { getLocalStream, getRemoteStream } from 'src/store/peer'

export default defineComponent({
  name: 'PageChat',
  setup(_, { root: { $store } }) {
    const local = computed<boolean>(() => $store.getters['chat/local'])
    const remoteId = computed<string>(
      () => $store.getters['chat/remoteUserName']
    )
    const localVideo = ref<HTMLVideoElement>({})
    const remoteStream = ref<MediaStream>(null)
    const localStream = ref<MediaStream>(null)

    const ready = computed<boolean>(() => $store.getters['chat/ready'])

    const ongoing = computed<boolean>(() => $store.getters['chat/ongoing'])

    watch(
      () => $store.getters['chat/ongoing'],
      (ongoing: boolean) => {
        if (ongoing) {
          localVideo.value.autoplay = true
          localVideo.value.muted = true
          localVideo.value.volume = 0
          // localVideo.value.srcObject = getLocalStream()
          remoteStream.value = getRemoteStream()
          localStream.value = getLocalStream()
        }
      }
    )

    const end = () => $store.dispatch('chat/close')

    return {
      localVideo,
      localStream,
      ready,
      ongoing,
      end,
      local,
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
