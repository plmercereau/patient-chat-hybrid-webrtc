<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'
import { store } from './store'

export default defineComponent({
  name: 'App',
  setup() {
    onMounted(async () => {
      await store.dispatch('chat/load')
      if (store.getters['chat/server']) {
        console.log('FOUND A SERVER. START PEERJS')
        store.dispatch('chat/startPeerClient')
      }
      store.watch(
        (state, getters) => getters['chat/server'],
        () => {
          console.log('server changed')
          // TODO RESET PEER SERVER
          store.dispatch('chat/startPeerClient')
        }
      )
    })
  }
})
</script>
