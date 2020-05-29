import { Platform } from 'quasar'

const checkPermission = (permission: string) =>
  new Promise((resolve, reject) => {
    if (cordova.plugins.diagnostic?.requestRuntimePermission) {
      cordova.plugins.diagnostic?.requestRuntimePermission(
        status => {
          switch (status) {
            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
              console.log(`Permission granted to use ${permission}`)
              resolve()
              break
            case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
              console.log(
                `Permission to use ${permission} has not been requested yet`
              )
              resolve()
              break
            case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
              console.log(`Permission denied to use ${permission} - ask again?`)
              reject()
              break

            case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
              console.log(
                `Permission permanently denied to use ${permission} - guess we won't be using it then!`
              )
              reject()
              break
          }
        },
        error => {
          console.error('The following error occurred: ' + error)
          reject()
        },
        permission
      )
    } else resolve()
  })

export const checkPermissions = async () => {
  if (Platform.is.cordova) {
    await checkPermission(cordova.plugins.diagnostic.permission.CAMERA)
    await checkPermission(cordova.plugins.diagnostic.permission.RECORD_AUDIO)
    await checkPermission(
      cordova.plugins.diagnostic.permission.READ_EXTERNAL_STORAGE
    )
  }
  // cordova.plugins.diagnostic.isWifiAvailable &&
  //   cordova.plugins.diagnostic.isWifiAvailable(
  //     res => {
  //       console.log('wifi avaiabilitiy: ' + res)
  //     },
  //     () => {
  //       console.log('Error in checking WIFI')
  //     }
  //   )
}
