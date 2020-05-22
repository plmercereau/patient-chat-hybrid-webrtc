<template lang="pug">
  q-page
    div host: {{server}}
    q-btn(@click="refresh") Refresh
    q-list(bordered separator)
      q-item(v-for="service in servers" :key="service.host" clickable v-ripple)
        q-item-section {{service}}
    //- div(v-if="apkUrl")
    //-   a(:href="apkUrl") {{ apkUrl }}
</template>

<script lang="ts">
import { ref, defineComponent, computed } from '@vue/composition-api'
// import { Service } from 'src/types'
import { store } from 'src/store'

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const apkUrl = ref<string>()

    const servers = computed(() => store.getters['chat/servers'])
    const server = computed(() => store.getters['chat/peerjs'])
    const refresh = async () => await store.dispatch('chat/listServers')

    return { apkUrl, server, servers, refresh }
  }
})
</script>
