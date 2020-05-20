import { Platform } from 'quasar'

interface CordovaPlugins {
  zeroconf: ZeroConfPlugin
}
interface Service {
  domain: string
  type: string
  name: string
  port: number
  hostname: string
  ipv4Addresses: string[]
  ipv6Addresses: string[]
  txtRecord: Record<string, string>
}
interface ServiceResult {
  action: string
  service: Service
}
type SuccessCallback = (success: string) => void
interface ZeroConfPlugin {
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
    failure: Function
  ) => void
  stop: (successCallback: SuccessCallback, failureCallback?: Function) => void
  watch: (
    type: string,
    domain: string,
    success: (result: ServiceResult) => void,
    failure: Function
  ) => void
  unwatch: (
    type: string,
    domain: string,
    success: SuccessCallback,
    failure: Function
  ) => void
  close: (successCallback: SuccessCallback, failureCallback?: Function) => void
  reInit: (successCallback: SuccessCallback, failureCallback?: Function) => void
}
const plugins = Platform.is.cordova
  ? (cordova.plugins as CordovaPlugins)
  : undefined

export default plugins?.zeroconf

// TODO See how it is possible to use mDNS:
// zeroConfPlugin.register(
//   '_http._tcp.',
//   'local.',
//   'poco',
//   3000,
//   {
//     foo: 'bar'
//   },
//   function success(result) {
//     const action = result.action // 'registered'
//     const service = result.service
//     console.log('BINGOOOOOOOOO')
//     console.log(action)
//     console.log(service)
//   },
//   (error: any) => {
//     console.log('IMPOSSIBLE TO CREATE SERVICE')
//   }
// )
