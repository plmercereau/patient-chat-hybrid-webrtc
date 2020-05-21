<template lang="pug">
  q-page.row.items-center.justify-evenly
    div.col-12(v-if="serverUrl")
      a(:href="serverUrl.value") {{ serverUrl.value }}
    div Val: {{val}}
</template>

<script lang="ts">
import zeroConfPlugin from 'components/zeroconf-plugin'
import { startNodeProject } from 'components/nodejs-plugin'
import { ref, defineComponent, onMounted } from '@vue/composition-api'
import axios from 'axios'
import { Platform } from 'quasar'
export default defineComponent({
  name: 'PageIndex',
  setup() {
    const serverUrl = ref<string>()
    const val = ref<string>()

    onMounted(async () => {
      try {
        const result = await axios.get('/api/turn')
        console.log(result.data)
        val.value = JSON.stringify(result.data)
      } catch (error) {
        console.warn(error)
      }
    })

    onMounted(() => {
      if (Platform.is.cordova) {
        zeroConfPlugin?.getHostname(
          hostname => {
            startNodeProject()
            serverUrl.value = `http://${hostname}:3000`
          },
          (error: unknown) => {
            console.log('Impossible to get hostname')
            console.log(error)
          }
        )
      }
    })
    return { serverUrl, val }
  }
})

// export default Vue.extend({
//   name: 'PageIndex',
//   components: { ExampleComponent },
//   data() {
//     const todos: Todo[] = [
//       {
//         id: 1,
//         content: 'ct1'
//       },
//       {
//         id: 2,
//         content: 'ct2'
//       }
//     ]
//     const meta: Meta = {
//       totalCount: 1200
//     }

//     const serverUrl = ref<string>()
//   axios.get('/api/peerjs')
//     zeroConfPlugin.getHostname(
//       hostname => {
//         startNodeProject()
//         serverUrl.value = `http://${hostname}:3000`
//       },
//       (error: unknown) => {
//         console.log('Impossible to get hostname')
//         console.log(error)
//       }
//     )
//     return { todos, meta, serverUrl }
//   }
// })
</script>
