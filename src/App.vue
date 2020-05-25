<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from '@vue/composition-api'
import { PeerServer } from './common/types'

export default defineComponent({
  name: 'App',
  setup(_, { root: { $router, $store } }) {
    onMounted(async () => {
      await $store.dispatch('chat/load')

      // * Go to the 'Chat' page when a call started, if not already.
      watch(
        () => $store.getters['chat/calling'],
        (calling: boolean) => {
          if (calling && $router.currentRoute.path !== '/chat')
            $router.push('/chat')
        }
      )

      // * When a server was initially set, but goes to null, it means a call ended (disconnection)
      // * As a consequence, go back to the main page, and reset the PeerJS client to the local server
      watch(
        () => $store.getters['chat/server'],
        (newServer: PeerServer | null, oldServer: PeerServer | null) => {
          if (!newServer && !!oldServer) {
            $store.dispatch('chat/localConnect')
            if ($router.currentRoute.path !== '/') $router.push('/')
          }
        }
      )
    })
  }
})
</script>
