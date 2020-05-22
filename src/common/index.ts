export { checkServer, SERVICE_PORT } from './server' // TODO rename, it's confusing
export { startServer } from './express'
export { permissionsPlugin } from './permissions'
export { devicePlugin } from './device'
export { getHostname, register, watch, zeroconfPlugin } from './zeroconf'
export const SERVICE_NAME = 'patientchat'
