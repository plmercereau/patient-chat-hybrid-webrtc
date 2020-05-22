<template lang="pug">
  q-layout(view='lHh Lpr lFf')
    q-header(elevated)
      q-toolbar
        q-btn(flat, dense, round, icon='menu', aria-label='Menu', @click='leftDrawerOpen = !leftDrawerOpen')
          q-toolbar-title
            | Quasar App
          div Quasar v{{ $q.version }}
    q-drawer(v-model='leftDrawerOpen', show-if-above, bordered, content-class='bg-grey-1')
      q-list
        q-item-label.text-grey-8(header) Essential Links
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
export default {
  name: 'MainLayout',

  data() {
    return {
      leftDrawerOpen: false
    }
  }
}
</script>
