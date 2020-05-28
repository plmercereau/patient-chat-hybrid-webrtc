<template lang="pug">
  q-page
    q-spinner(v-if="starting" color="primary" size="3em")
    q-card(v-if="embedded" flat bordered)
      q-card-section.text-h6 Connected devices
      q-card-section
        q-list(bordered separator)
          q-item(v-for="service in servers" :key="service.host" clickable v-ripple @click="select(service)")
            q-item-section {{service.name}}
          q-spinner(v-if="!servers.length" color="primary" size="3em")
    q-card(v-else flat bordered)
      q-card-section You cannot browse or call people from this device, but you can be called.
    //- q-card(flat bordered v-if="server")
    //-   q-card-section.text-h6 Share the app
    //-   q-card-section.text-center
    //-     qrcode-vue(:value="apkUrl" size=200)
    //-     a(:href="apkUrl") {{apkUrl}}
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
// import QrcodeVue from 'qrcode.vue'

import { PeerServer } from 'src/common/types'
import { checkServer } from 'src/common'

export default defineComponent({
  name: 'PageIndex',
  // components: {
  //   QrcodeVue
  // },
  setup(_, { root: { $store, $q } }) {
    const servers = computed(() => $store.getters['chat/servers'])
    const embedded = computed(() => $store.getters['server/embedded'])
    const starting = computed(() => $store.getters['server/starting'])
    const ready = computed(() => $store.getters['server/ready'])
    // const apkUrl = computed(
    //   () => `${$store.getters['server/publicUrl']}/package.apk`
    // )

    const select = async (server: PeerServer) => {
      if (await checkServer(server)) {
        $store.dispatch('chat/connect', server)
      }
    }

    return {
      // apkUrl,
      embedded,
      servers,
      starting,
      ready,
      select
    }
  }
})
</script>
