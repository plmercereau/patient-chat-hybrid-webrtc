import { Platform } from 'quasar'
import { Service } from './types'

interface CordovaPlugins {
  diagnostic?: unknown
  zeroconf: ZeroConfPlugin
}
interface ServiceResult {
  action: string
  service: Service
}

export type ServiceEventCallback = (result: ServiceResult) => void

type SuccessCallback = (success: string) => void
interface ZeroConfPlugin {
  registerAddressFamily: 'ipv4' | 'ipv6' | 'any'
  getHostname: (
    successCallback: SuccessCallback,
    failureCallback?: Function
  ) => void
  register: (
    type: string,
    domain: string,
    name: string,
    port: number,
    txtRecord: Record<string, string>,
    success: ServiceEventCallback,
    failure?: Function
  ) => void
  unregister: (
    type: string,
    domain: string,
    name: string,
    success: SuccessCallback,
    failure?: Function
  ) => void
  stop: (successCallback: SuccessCallback, failureCallback?: Function) => void
  watch: (
    type: string,
    domain: string,
    success: (result: ServiceResult) => void,
    failure?: Function
  ) => void
  unwatch: (
    type: string,
    domain: string,
    success: SuccessCallback,
    failure?: Function
  ) => void
  close: (successCallback: SuccessCallback, failureCallback?: Function) => void
  reInit: (successCallback: SuccessCallback, failureCallback?: Function) => void
}

const DEFAULT_TYPE = '_http._tcp.'
const DEFAULT_DOMAIN = 'local.'
const getPlugin = () =>
  Platform.is.cordova
    ? (cordova.plugins as CordovaPlugins)?.zeroconf
    : undefined

export const zeroconfPlugin = getPlugin()

if (zeroconfPlugin) zeroconfPlugin.registerAddressFamily = 'ipv4'

export const getHostName = () =>
  new Promise<string>((resolve, reject) => {
    const plugin = Platform.is.cordova
      ? (cordova.plugins as CordovaPlugins)?.zeroconf
      : undefined
    if (!plugin) resolve('localhost')
    // TODO other name when SPA? l
    else
      plugin.getHostname(
        hostName => resolve(hostName),
        (error: unknown) => reject(error)
      )
  })

export const register = (
  type: string,
  domain: string,
  name: string,
  port: number,
  txtRecord: Record<string, string>
) =>
  new Promise<ServiceResult>((resolve, reject) => {
    const plugin = getPlugin()
    if (!plugin)
      reject('Zeroconf service registration only works with Cordova.')
    else
      plugin.register(
        type,
        domain,
        name,
        port,
        txtRecord,
        result => resolve(result),
        (error: unknown) => reject(error)
      )
  })

export const watch = (
  eventHandler: ServiceEventCallback,
  type: string = DEFAULT_TYPE
) => {
  const plugin = getPlugin()
  if (plugin) {
    plugin.watch(type, DEFAULT_DOMAIN, eventHandler, (error: unknown) =>
      console.log('Error watching the zeroconf services' + error)
    )
  }
}

export const unwatch = (type: string = DEFAULT_TYPE) =>
  new Promise<void>((resolve, reject) => {
    const plugin = getPlugin()
    if (!plugin) resolve()
    else
      plugin.unwatch(
        type,
        DEFAULT_DOMAIN,
        () => resolve(),
        (error: unknown) => reject(error)
      )
  })
