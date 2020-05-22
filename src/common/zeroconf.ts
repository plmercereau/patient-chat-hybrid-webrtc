import { Platform } from 'quasar'
import { Service } from './types'

interface CordovaPlugins {
  zeroconf: ZeroConfPlugin
}
interface ServiceResult {
  action: string
  service: Service
}
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
    success: (result: ServiceResult) => void,
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

export const watch = (type: string, domain: string, watchDuration = 3000) =>
  new Promise<Service[]>((resolve, reject) => {
    const result: Service[] = []
    if (!zeroconfPlugin) resolve([])
    else {
      console.log('TRY TO WATCH SERVICES....')
      setTimeout(() => {
        console.log('UNWATCH ZEROCONF SERVICES')
        zeroconfPlugin.unwatch(
          type,
          domain,
          () => resolve(result),
          (error: unknown) =>
            reject('Error unwatching the zeroconf services' + error)
        )
      }, watchDuration)
      console.log('WATCH ZEROCONF SERVICES')
      zeroconfPlugin.watch(
        type,
        domain,
        res => {
          console.log(`FOUND SERVICE: ${JSON.stringify(res)}`)
          result.push(res.service) // TODO filter
        },
        (error: unknown) =>
          reject('Error watching the zeroconf services' + error)
      )
    }
  })
