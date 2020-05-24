import axios from 'axios'

import { PeerServer, Service } from './types'

export const SERVICE_NAME = 'patientchat'
export const SERVICE_PORT = 3000

export const serverPath = (server: PeerServer) =>
  process.env.DEV
    ? `/servers/${server.host}/${server.port}`
    : `${server.secure ? 'https' : 'http'}://${server.host}:${server.port}`

export const checkServer = async (server: PeerServer | null) => {
  // TODO timeout + multiple attempts
  if (!server) return false
  const path = serverPath(server)
  try {
    const result = await axios.get(`${path}/healthz`)
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
