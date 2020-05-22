import axios from 'axios'
import { LocalStorage } from 'quasar'
import { Ref } from '@vue/composition-api'

import { PeerServer, Service } from './types'

export const SERVICE_PORT = 3000

export const checkServer = async (server: PeerServer | null) => {
  // TODO timeout + multiple attempts
  if (!server) return false
  const protocol = server.secure ? 'https' : 'http'
  try {
    console.log(
      `CHECK SERVER: ${protocol}://${server.host}:${server.port}/healthz`
    )

    const result = await axios.get(
      `${protocol}://${server.host}:${server.port}/healthz`
    ) // TODO health check
    if (result.status === 200) {
      console.log('CHECK SERVER OK') // TODO remove
      return true
    } else return false
  } catch (error) {
    console.log('CHECK SERVER: ERROR') // TODO remove
    return false
  }
}

// TODO REUSE
export const pushService = (services: Ref<Service[]>, service: Service) => {
  // * Tweaks a new name when the service name is unknown
  const newName = service.name.startsWith('unknown')
    ? service.ipv4Addresses[0]
    : service.name
  if (service.port == SERVICE_PORT && service.ipv4Addresses[0] && newName) {
    if (
      !services.value.some(
        ({ name, domain, type, hostname }) =>
          name === newName &&
          domain == service.domain &&
          type === service.type &&
          hostname === service.hostname
      )
    ) {
      //   if (!LocalStorage.has('server')) {
      // ! Replaces the exsisting persisted value by the first service found. Not ideal
      if (!services.value.length) LocalStorage.set('server', service)
      //   }
      services.value = [...services.value, { ...service, name: newName }] // TODO ugly
    }
  }
}
