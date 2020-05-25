<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from '@vue/composition-api'

export default defineComponent({
  name: 'App',
  setup(_, { root: { $router, $store } }) {
    onMounted(async () => {
      // TODO: connect après que le serveur soit prêt!!!
      await $store.dispatch('chat/load')

      // * Go to the 'Chat' page when a call started, if not already.
      watch(
        () => $store.getters['chat/calling'],
        (calling: boolean) => {
          if (calling && $router.currentRoute.path !== '/chat')
            $router.push('/chat')
        }
      )
    })
  }
})
</script>
