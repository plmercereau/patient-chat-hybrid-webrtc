// import { permissionsPlugin } from 'src/common'
import { setLocalStream, getLocalStream } from 'src/store/peer'

// ? Move elsewhere?
export const startCamera = async () => {
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

export const stopCamera = () => {
  getLocalStream()
    ?.getTracks()
    .forEach(track => track.stop())
}
