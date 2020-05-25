// import { permissionsPlugin } from 'src/common'
import { setLocalStream, getLocalStream } from 'src/store/peer'

// ? Move elsewhere?
const setNavLocalStream = async () => {
  if (navigator.mediaDevices) {
    const media = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        facingMode: 'user', // 'environment'
        echoCancellation: true,
        noiseSuppression: true,
        width: { ideal: 320 },
        height: { ideal: 240 }
      }
    })
    setLocalStream(media)
    return media
  } else {
    throw Error('NO MEDIA DEVICES??')
  }
}

// ? Move elsewhere?
export const startCamera = async () => {
  return await setNavLocalStream()
  // TODO make the plugin permission work
  //   if (permissionsPlugin) {
  //     console.log('PERMISSION PLUGIN')
  //     const perms = [
  //       permissionsPlugin.MODIFY_AUDIO_SETTINGS,
  //       permissionsPlugin.RECORD_AUDIO,
  //       permissionsPlugin.CAPTURE_AUDIO_OUTPUT,
  //       permissionsPlugin.CAMERA
  //     ]

  //     permissionsPlugin.requestPermission(
  //       perms,
  //       () => setNavLocalStream(),
  //       () => console.log('FUNCKING NIGHTMARE')
  //     )
  //   } else {
  //     console.log('NO PERMISSION PLUGIN')
  //     setNavLocalStream()
  //   }
}

export const stopCamera = () => {
  getLocalStream()
    ?.getTracks()
    .forEach(track => track.stop())
}
