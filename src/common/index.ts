export { checkServer, SERVICE_PORT, SERVICE_NAME } from './server' // TODO rename, it's confusing
export { startServer } from './express'
export { permissionsPlugin } from './permissions'
export { devicePlugin } from './device'
export {
  getHostName,
  register,
  watch,
  unwatch,
  zeroconfPlugin
} from './zeroconf'
