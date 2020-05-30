// import { permissionsPlugin } from 'src/common'
import { getLocalStream, setLocalStream } from 'src/store/peer'

// ? Move elsewhere?
export const startCamera = async () => {
  if (navigator.mediaDevices) {
    const media = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true
        // autoGainControl: true,
      },
      video: {
        facingMode: 'user', // 'environment'
        width: { ideal: 320 },
        height: { ideal: 240 }
      }
    })
    console.log('camera started')
    setLocalStream(media)
    return media
  } else {
    throw Error('NO MEDIA DEVICES??')
  }
}

export const stopCamera = () => {
  getLocalStream()
    ?.getTracks()
    .forEach(track => track.stop())
}
