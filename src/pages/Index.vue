<template lang="pug">
  q-page
    q-card(flat bordered)
      q-card-section.text-h6 Current server
      q-card-section.q-pt-none(v-if="server") {{server.name}}
      q-card-section(v-else)
        q-btn(@click="start" v-if="!ready") Start local server
        q-spinner(v-else color="primary" size="3em")
    q-card(flat bordered)
      q-card-section.text-h6 Servers
      q-card-section
        q-list(bordered separator)
          q-item(v-for="service in servers" :key="service.host" clickable v-ripple)
            q-item-section {{service.name}}
    q-card(flat bordered v-if="server")
      q-card-section.text-h6 Share the app
      q-card-section
        qrcode-vue.text-center(:value="apkUrl" size=200)
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from '@vue/composition-api'
import QrcodeVue from 'qrcode.vue'

import { store } from 'src/store'

export default defineComponent({
  name: 'PageIndex',
  components: {
    QrcodeVue
  },
  setup() {
    const servers = computed(() => store.getters['chat/servers'])
    const server = computed(() => store.getters['chat/server'])
    const starting = computed(() => store.getters['server/starting'])
    const ready = computed(() => store.getters['server/ready'])
    const apkUrl = computed(
      () =>
        `${
          store.getters[ready.value ? 'chat/publicUrl' : 'chat/url']
        }/package.apk`
    )
    onMounted(() => {
      store.dispatch('chat/watchServers')
    })

    const start = () => store.dispatch('server/start')
    return { apkUrl, server, servers, starting, ready, start }
  }
})
</script>
