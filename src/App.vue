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
    })
  }
})
</script>
