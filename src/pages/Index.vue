<template lang="pug">
  q-page
    q-spinner(v-if="embedded && !ready && starting" color="primary" size="3em")
    q-card(flat bordered)
      q-card-section.text-h6 Current server
      q-card-section.q-pt-none(v-if="server") {{server.name}}
    q-card(flat bordered v-if="canBrowse")
      q-card-section.text-h6 Servers
      q-card-section
        q-list(bordered separator)
          q-item(v-for="service in servers" :key="service.host" clickable v-ripple @click="select(service)")
            q-item-section {{service.name}}
    q-card(flat bordered v-if="server")
      q-card-section.text-h6 Share the app
      q-card-section.text-center
        qrcode-vue(:value="apkUrl" size=200)
        a(:href="apkUrl") {{apkUrl}}
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from '@vue/composition-api'
import QrcodeVue from 'qrcode.vue'

import { PeerServer } from 'src/common/types'
import { checkServer } from 'src/common'

export default defineComponent({
  name: 'PageIndex',
  components: {
    QrcodeVue
  },
  setup(_, { root: { $store, $q } }) {
    const servers = computed(() => $store.getters['chat/servers'])
    const server = computed(() => $store.getters['chat/server'])
    const embedded = computed(() => $store.getters['server/embedded'])
    const canBrowse = !!$q.platform.is.cordova
    const down = computed(() => $store.getters['server/down'])
    const starting = computed(() => $store.getters['server/starting'])
    const ready = computed(() => $store.getters['server/ready'])
    const apkUrl = computed(
      () => `${$store.getters['server/publicUrl']}/package.apk`
    )
    onMounted(() => {
      $store.dispatch('chat/watchServers')
    })

    const select = async (server: PeerServer) => {
      if (await checkServer(server)) {
        console.log(`SELECTED ${JSON.stringify(server)}`)
        $store.dispatch('chat/connect', server)
      }
    }

    return {
      apkUrl,
      server,
      embedded,
      canBrowse,
      servers,
      down,
      starting,
      ready,
      select
    }
  }
})
</script>
