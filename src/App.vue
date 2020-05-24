<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@vue/composition-api'

export default defineComponent({
  name: 'App',
  setup(_, { root: { $router, $route, $store } }) {
    onMounted(async () => {
      // TODO: startPeerClient après que le serveur soit prêt!!!
      await $store.dispatch('chat/load')
      if ($store.getters['chat/server']) {
        console.log('FOUND A SERVER. START PEERJS')
        await $store.dispatch('chat/startPeerClient')
      }
      // TODO watch username change: disconnect/reconnect from peerjs
      $store.watch(
        (_, getters) => getters['chat/server'],
        () => {
          console.log('server changed')
          // TODO RESET PEER SERVER
          $store.dispatch('chat/startPeerClient')
        }
      )

      // * Go to the 'Chat' page when a call started, if not already.
      $store.watch<boolean>(
        (_, getters) => getters['chat/calling'],
        connected => {
          if (connected && $route.path !== '/chat') $router.push('/chat')
        }
      )
    })
  }
})
</script>
