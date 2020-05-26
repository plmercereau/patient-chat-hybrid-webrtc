# Local Video Chat

## How it works

### Frontend

The frontend is coded in [Vue](https://vuejs.org/) through the [Quasar framework](https://quasar.dev/).

Quasar allows to define multiple destination platforms: Single Page Applications, Progressive Web Apps, Android or IOS through Apache's [Cordova](https://cordova.apache.org/) or Ionic's [Capacitor](https://capacitor.ionicframework.com/), OSX or Windows though [Electron](https://www.electronjs.org/)...

This project focuses on the use of Cordova to deliver an Android app, but also generates an SPA for developement and testing purposes.

### Backend

The Android app embeds a [NodeJS environment](https://code.janeasystems.com/nodejs-mobile). It then runs an [HTTP Express server](https://expressjs.com/), that includes a [PeerJS TURN server](https://github.com/peers/peerjs-server) that acts as a WebRTC client broker.

This backend server is then published as a Bonjour/Zeroconf/mDNS service.

By default, the Android user connects to its own PeerJS server and is listening to any call.

Any client can then get the list of available peers though DNS Service Discovery.

The user picks one server from this list, checks if there is already someone connected to it, then connects with the [PeerJS client](https://peerjs.com/) and call the other person though [WebRTC](https://webrtc.org/).

When the call ends, the client disconnects from the remote server and connects again to its own local server, so it waits for calls.

### Why not a single Android "server" app + SPA "client" ?

We could have used the embedded Node Express server to serve a static SPA app, so other users would not have needed to install an Android app. However:

- `https` is required to get `getMediaDevice()` working, and an SSL certificate can't be obtained without internet (e.g. Let's Encrypt). Only self-signed certificates are then possible, but will raise an alert on the client that the site is not secure, and will possibly still flag context as unsecure and therefore block video.
- Service Discovery through Bonjour/Zeroconf would not have been available. The client would have needed to enter the server path to start the application. It could have been mitigated by setting a QR-code / SMS sending system to get the link, plus in installing the client as a PWA
- If the user running the initial server leaves, everyone in the network is disconnected. While it is not a problem in the case of a two-users-only network, this would become messy if more people use the same network.

The main caveats for using an Android app everywhere is the need of the internet to install the app from the Google Playstore or any other place. This can be mitigated in serving the apk on the Express server for download (e.g. through a QR-code or an SMS), or finding other ways to share the file though a local network. The link could be available on the client side through a QR code.

## Development

### Prerequisites

For Web developement, you will need Node to be installed.

For Android developement, you will need the Android SDK, the Android NDK, etc.

TODO: complete this

### Clone

```bash
git clone https://github.com/plmercereau/patient-chat-hybrid-webrtc
cd patient-chat-hybrid-webrtc
```

### Install dependencies

```bash
yarn
cd server
npm install
cd ..
```

### Android

TODO: Put the following tasks into Corvova hooks.

- [Steps to patch the cordova-nodejs-module](https://github.com/JaneaSystems/nodejs-mobile/issues/239)
- `cd src-cordova/www && ln -sFf ../../server nodejs-project`
- `cd server && npm install``

### Start the app in 'web' mode

You have to run three services in parallel:

1. The Express server

```bash
cd server
npm run dev
```

2. Its mDNS publication

```bash
dns-sd -R <service_name> _http._tcp. local. 3000 name=patientchat
```

3. The Web client (served over WebPack)

```bash
quasar dev
```

## Build the app for production

### Build web version

```bash
quasar build
```

### Build android version

## TODO

### Prototype

- [ ] Pick the right permissions
- [ ] Prompt Android permissions
- [x] hide own local server from the list of servers
- [ ] build a "stable" apk to test between devices and share with the team
- [ ] Double check if server works correclty in background. Seems ok.
  - [nodejs plugin side](https://github.com/JaneaSystems/nodejs-mobile/issues/104) and [a dedicated plugin](https://github.com/katzer/cordova-plugin-background-mode).

### Strengthening

- [ ] improve disconnection UX: send a 'end call' event, instead of waiting for the connection to be lost
- [ ] change the server port from 3000 to something else
- [ ] "calling" spinner
- [ ] simpler navigation bar
- [ ] custom video controls
- [ ] better local video presentation, e.g. bottom-right of the remote video
- [ ] put the service discovery / service publishing / service information (e.g. online, busy...) on the server side

### Later

- [ ] adjust video/audio quality to the existing bandwidth, latency, etc.
- [ ] "calling" prompt / put the app in the foreground when running in the background
- [ ] let the Android app set a Wifi hotspot
- [ ] let the Android app select a Wifi hostpot?
- [ ] Share the apk. Options:
  - send the server url by SMS
  - print the server url on a QR code
- [ ] publish to the app store
- [ ] build and publish with GH Actions or another CI tool

### Nice to try

- [ ] iOS app
- [ ] Electron app

## Not applicable anymore

- SSL / unable to run video in insecure contexts
  - Temporary workaround: whitelist http://<hostname>:3000 by opening chrome://flags and search for unsafely-treat-insecure-origin-as-secure
  - check if a self-signed certificate would work
    1. https://github.com/jfromaniello/selfsigned#readme
    2. https://github.com/JaneaSystems/nodejs-mobile/issues/165
    3. https://flaviocopes.com/express-https-self-signed-certificate/
  - https://w3c.github.io/webappsec-secure-contexts/
  - https://medium.com/@bramus/on-secure-contexts-in-firefox-https-for-local-development-and-a-potential-nice-gesture-by-cea4ab4903a
  - Let's encrypt would require an internet connection
- serve the SPA through a captive portal (may require root access)
- change the device hostname (may require root access)
- change the express server port to 80 (requires root access)
- find a way to use mDNS/zeroconf service in the browser
