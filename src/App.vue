<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from '@vue/composition-api'
import { PeerServer } from './common/types'
import { checkPermissions } from './common'

export default defineComponent({
  name: 'App',
  setup(_, { root: { $router, $store } }) {
    onMounted(() => {
      checkPermissions().then(() => {
        $store.dispatch('chat/load')
      })

      // * Go to the 'Chat' page when a call started, if not already.
      watch(
        () => $store.getters['chat/ongoing'],
        (ongoing: boolean) => {
          if (ongoing && $router.currentRoute.path !== '/chat')
            $router.push('/chat')
        }
      )

      // * When a server was initially set, but goes to null, it means a call ended (disconnection)
      // * As a consequence, go back to the main page, and reset the PeerJS client to the local server
      watch(
        () => $store.getters['chat/server'],
        (newServer: PeerServer | null, oldServer: PeerServer | null) => {
          if (!newServer && !!oldServer) {
            console.log('')
            $store.dispatch('chat/localConnect')
            if ($router.currentRoute.path !== '/') $router.push('/')
          }
        }
      )
    })
  }
})
</script>
