<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from '@vue/composition-api'
import { checkPermissions } from './common'

export default defineComponent({
  name: 'App',
  setup(_, { root: { $router, $store, $q } }) {
    onMounted(() => {
      checkPermissions().then(() => {
        if ($store.getters['server/embedded'])
          $q.loading.show({
            message: 'Starting the server...'
          })
        $store.dispatch('chat/load')
      })

      // * Go to the 'Chat' page when a call started, if not already.
      watch(
        () => $store.getters['chat/ongoing'],
        (ongoing: boolean) => {
          if (ongoing) {
            if ($router.currentRoute.path !== '/chat') $router.push('/chat')
          } else {
            if ($router.currentRoute.path !== '/') $router.push('/')
          }
        }
      )

      watch(
        () => $store.getters['server/ready'],
        (ready: boolean) => ready && $q.loading.hide()
      )
    })
  }
})
</script>
