import { Platform } from 'quasar'
import { Service } from './types'

interface CordovaPlugins {
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

export const zeroconfPlugin = Platform.is.cordova
  ? (cordova.plugins as CordovaPlugins).zeroconf
  : undefined

if (zeroconfPlugin) zeroconfPlugin.registerAddressFamily = 'ipv4'

export const getHostname = () =>
  new Promise<string>((resolve, reject) => {
    if (!zeroconfPlugin) resolve('localhost')
    // TODO other name when SPA? l
    else
      zeroconfPlugin.getHostname(
        hostname => resolve(hostname),
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
    if (!zeroconfPlugin)
      reject('Zeroconf service registration only works with Cordova.')
    else
      zeroconfPlugin.register(
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
  if (zeroconfPlugin) {
    zeroconfPlugin.watch(type, DEFAULT_DOMAIN, eventHandler, (error: unknown) =>
      console.log('Error watching the zeroconf services' + error)
    )
  }
}

export const unwatch = (type: string = DEFAULT_TYPE) =>
  new Promise<void>((resolve, reject) => {
    if (!zeroconfPlugin) resolve()
    else
      zeroconfPlugin.unwatch(
        type,
        DEFAULT_DOMAIN,
        () => resolve(),
        (error: unknown) => reject(error)
      )
  })
