<template lang="pug">
  q-page.row.items-center.justify-evenly
    div.col-12
      a(:href="serverUrl.value") {{ serverUrl.value }}
    example-component(title='Example component' active :todos='todos' :meta='meta')
</template>

<script lang="ts">
import Vue from 'vue'
import zeroConfPlugin from 'components/zeroconf-plugin'
import { startNodeProject } from 'components/nodejs-plugin'
import ExampleComponent from 'components/CompositionComponent.vue'
import { Todo, Meta } from 'components/models'
import { ref } from '@vue/composition-api'

export default Vue.extend({
  name: 'PageIndex',
  components: { ExampleComponent },
  data() {
    const todos: Todo[] = [
      {
        id: 1,
        content: 'ct1'
      },
      {
        id: 2,
        content: 'ct2'
      }
    ]
    const meta: Meta = {
      totalCount: 1200
    }

    const serverUrl = ref<string>()

    zeroConfPlugin.getHostname(
      hostname => {
        startNodeProject()
        serverUrl.value = `http://${hostname}:3000`
      },
      (error: unknown) => {
        console.log('Impossible to get hostname')
        console.log(error)
      }
    )
    return { todos, meta, serverUrl }
  }
})
</script>
