<template lang="pug">
  q-layout(view='lHh Lpr lFf')
    q-header(elevated)
      q-toolbar
        q-btn(flat, dense, round, icon='menu', aria-label='Menu', @click='toggleDrawer()')
          q-toolbar-title Patient Chat - {{userName}}
    q-drawer(v-model='leftDrawerOpen', show-if-above, bordered, content-class='bg-grey-1')
      q-list
        q-item-label.text-grey-8(header) Menu
        q-item(clickable to="/#")
          q-item-section(avatar)
            q-icon(name='home')
          q-item-section
            q-item-label Home
        q-item(clickable to="/chat")
          q-item-section(avatar)
            q-icon(name='videocam')
          q-item-section
            q-item-label Video chat
            q-item-label(caption) Start a video chat
              
    q-page-container
      router-view
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import { store } from 'src/store'

export default defineComponent({
  name: 'MainLayout',
  setup() {
    const leftDrawerOpen = ref(false)
    const userName = computed(() => store.getters['chat/userName'])
    const toggleDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }
    return { leftDrawerOpen, userName, toggleDrawer }
  }
})
</script>
