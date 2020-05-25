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
        q-item(:clickable="ongoing" :to="ongoing ? '/chat' : undefined")
          q-item-section(avatar)
            q-icon(:name="ongoing ? 'videocam' : 'videocam_off'")
          q-item-section
            q-item-label Video chat
            q-item-label(caption) Start a video chat
              
    q-page-container
      router-view
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'MainLayout',
  setup(_, { root: { $store } }) {
    const leftDrawerOpen = ref(false)
    const userName = computed(() => $store.getters['chat/userName'])
    const ongoing = computed(() => $store.getters['chat/ongoing'])

    const toggleDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }
    return { leftDrawerOpen, userName, ongoing, toggleDrawer }
  }
})
</script>
