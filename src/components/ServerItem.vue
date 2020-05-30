<template lang="pug">
  q-item(:clickable="available" v-ripple @click="call()")
    q-item-section {{server.name}}
    q-item-section(avatar)
      q-avatar(v-if="!calling" :color="avatar.color" text-color="white" :icon="avatar.icon")
      q-spinner(v-else color="primary" size="3em")
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  toRefs,
  onMounted,
  onUnmounted,
  computed
} from '@vue/composition-api'

import { checkServer, serverPath } from 'src/common'
import { PeerServer } from 'src/common/types'
import axios from 'axios'

type Status = 'available' | 'busy' | 'empty' | 'offline'
const avatars: {
  [key in Status]: {
    icon: string
    color: string
  }
} = {
  available: {
    icon: 'call',
    color: 'green'
  },
  busy: {
    icon: 'block',
    color: 'red'
  },
  empty: {
    icon: 'query_builder',
    color: 'orange'
  },
  offline: {
    icon: 'device_unknown',
    color: 'grey'
  }
}

export default defineComponent({
  name: 'ServerItem',
  props: {
    server: {
      type: Object as PropType<PeerServer>,
      required: true
    }
  },
  setup(props, { root: { $store } }) {
    const { server } = toRefs(props)

    const status = ref<Status>('offline')
    const available = computed(() => status.value === 'available')
    const calling = ref<boolean>(false)

    const call = async () => {
      if (
        available.value &&
        !calling.value &&
        (await checkServer(props.server))
      ) {
        try {
          calling.value = true
          await $store.dispatch('chat/connect', server.value)
        } catch {
          calling.value = false
        }
      }
    }
    const updateStatus = () => {
      const path = serverPath(server.value)
      axios
        .get(`${path}/peerjs/peers`)
        .then(({ data }: { data: string[] }) => {
          if (data.length == 0) status.value = 'empty'
          else if (data.length == 1) status.value = 'available'
          else status.value = 'busy'
        })
        .catch(() => {
          status.value = 'offline' // ? remove through the store after X attempts?
        })
    }
    let interval: NodeJS.Timeout
    onMounted(() => {
      updateStatus()
      interval = setInterval(updateStatus, 5000)
    })
    onUnmounted(() => {
      clearInterval(interval)
    })

    const avatar = computed(() => avatars[status.value])
    return { call, calling, available, avatar }
  }
})
</script>
