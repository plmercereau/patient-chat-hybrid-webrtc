<template lang="pug">
  q-page
    div host: {{server}}
    q-list(bordered separator)
      q-item(v-for="service in servers" clickable v-ripple)
        q-item-section {{service.name}}
    div(v-if="apkUrl")
      a(:href="apkUrl") {{ apkUrl }}
</template>

<script lang="ts">
import { ref, defineComponent, computed } from '@vue/composition-api'
import { Service } from 'src/common'
import { store } from 'src/store'

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const apkUrl = ref<string>()

    const servers = ref<Service[]>([])

    const server = computed(() => {
      console.log(store.getters['server/peerjs'])
      return store.getters['server/peerjs']
    })

    return { apkUrl, servers, server }
  }
})
</script>
