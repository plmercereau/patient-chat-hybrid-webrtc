import axios from 'axios'

import { PeerServer, Service } from './types'

export const SERVICE_NAME = 'patientchat'
export const SERVICE_PORT = 3000

export const checkServer = async (server: PeerServer | null) => {
  // TODO timeout + multiple attempts
  if (!server) return false
  const protocol = server.secure ? 'https' : 'http'
  try {
    const result = await axios.get(
      `${protocol}://${server.host}:${server.port}/healthz`
    )
    if (result.status === 200) {
      return true
    } else return false
  } catch (error) {
    return false
  }
}

export const isValid = (service: Service): boolean =>
  service.port == SERVICE_PORT &&
  !!(service.hostname || service.ipv4Addresses[0]) &&
  service.txtRecord.name === SERVICE_NAME
