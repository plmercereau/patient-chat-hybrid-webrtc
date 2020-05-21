<template lang="pug">
  q-page
    q-list(bordered separator)
      q-item(v-for="service in servers" clickable v-ripple)
        q-item-section {{service.name}}
    div(v-if="apkUrl")
      a(:href="apkUrl") {{ apkUrl }}
</template>

<script lang="ts">
import { ref, defineComponent, onMounted, Ref } from '@vue/composition-api'
import { Platform } from 'quasar'

import zeroConfPlugin, { Service } from 'components/zeroconf-plugin'
import { startNodeProject } from 'components/nodejs-plugin'

const SERVICE_PORT = 3000

const pushService = (services: Ref<Service[]>, service: Service) => {
  if (service.port == SERVICE_PORT && service.name) {
    if (
      !services.value.some(
        ({ name, domain, type, hostname }) =>
          name === service.name &&
          domain == service.domain &&
          type === service.type &&
          hostname === service.hostname
      )
    ) {
      services.value = [...services.value, service] // TODO ugly
    }
  }
}

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const apkUrl = ref<string>()

    const servers = ref<Service[]>([])
    onMounted(() => {
      if (Platform.is.cordova && zeroConfPlugin) {
        zeroConfPlugin.getHostname(
          hostname => {
            startNodeProject(() => {
              console.log('The Express server is ready!')
              apkUrl.value = `http://${hostname}:3000/videochat.apk`
              // TODO register only if server is activated
              // TODO zeroConfPlugin.reInit, e.g. when network change?
              zeroConfPlugin.register(
                '_http._tcp.',
                'local.',
                hostname,
                SERVICE_PORT,
                {},
                () => {
                  console.log('Added service')
                }
              )
              zeroConfPlugin.watch(
                '_http._tcp.',
                'local.',
                ({ action, service }) => {
                  pushService(servers, service)
                  if (action === 'resolved') {
                    console.log(`RESOLVED ${service.name}`)
                  } else if (action === 'added') {
                    console.log(`ADDED: ${service.name}`)
                  }
                },
                () => {
                  console.log('ERROR WATCHING THE SERVICES')
                }
              )
            })
          },
          (error: unknown) => {
            console.log('Impossible to get hostname')
            console.log(error)
          }
        )
      }
    })
    return { apkUrl, servers }
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
