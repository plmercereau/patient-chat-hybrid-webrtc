<template lang="pug">
  q-page.row.items-center.justify-evenly
    example-component(title='Example component' active :todos='todos' :meta='meta')
</template>

<script lang="ts">
import Vue from 'vue'

import ExampleComponent from 'components/CompositionComponent.vue'
import { Todo, Meta } from 'components/models'
declare const nodejs: any // TODO

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
      },
      {
        id: 3,
        content: 'ct3'
      },
      {
        id: 4,
        content: 'ct4'
      },
      {
        id: 5,
        content: 'ct5'
      }
    ]
    const meta: Meta = {
      totalCount: 1200
    }

    function startupCallback(err: any) {
      if (err) {
        console.log(err)
      } else {
        console.log('Node.js Mobile Engine Started')
        nodejs.channel.send('Hello from Cordova!')
      }
    }

    function startNodeProject() {
      // nodejs.channel.setListener(channelListener)
      nodejs.start('main.js', startupCallback)
      // To disable the stdout/stderr redirection to the Android logcat:
      // nodejs.start('main.js', startupCallback, { redirectOutputToLogcat: false });
    }
    startNodeProject()
    return { todos, meta }
  }
})
</script>
