# Video Chat (videochat)

Local Video Chat

## Development

### Prerequisites

### Clone

### Install dependencies

```bash
yarn
cd server
npm install
```

### Android

TODO: Put the following tasks into Corvova hooks.

- [Steps to patch the cordova-nodejs-module](https://github.com/JaneaSystems/nodejs-mobile/issues/239)
- `cd src-cordova/www && ln -sFf ../../server nodejs-project`
- `cd server && npm install``

### Start the app in development mode

In two separate consoles:

```bash
cd server
npm run dev
```

```bash
quasar dev
```

## Build the app for production

### Build web version

```bash
quasar build
```

<!-- ### Copy web version to the Express server

```bash
cp -R dist src-cordova/www/client`
``` -->

### Build android version

## Architecture options

In any case, the Android app embeds a TURN server (PeerJS) that acts as a WebRTC broker client

### Android "server" + SPA "client

The Express server embedded in the Android app serves a version of the static SPA app.

- Pros
  - no need to install anything on client side
- Cons
  - https is required to get `getMediaDevice()` working, and an SSL certificate can't be obtained without internet (e.g. Let's Encrypt). Only self-signed certificates are then possible, but will raise an alert on the client that the site is not secure, and will possibly still flag context as unsecure and therefore block video. It may then be a deal breaker.
  - the client will need to enter the server path to start the application. It can be mitigated in setting a SR-code / SMS sending system to get the link, plus to install the client as a PWA

### Android everywhere

- Pros
  - ability to self-discover available server(s) in the netword with zeroconf
  - As a consequence, any device can run its own server, and is connected to it while waiting for the call. A second connection to the server triggers the call.
- Cons
  - Should install the app everywhere. The need of internet to get access to the Google Playstore can be mitigated in serving the apk on the Express server for download. The link could be available on the client side through a QR code.
  - Not able to serve the application through a captive portal (but it would have most likely required root access)

## TODO

- [ ] set Android permissions
- [x] hide own local server from the list of servers
- [ ] build a "stable" apk to test between devices and share with the team
- [ ] "calling" spinner
- [ ] improve disconnection UX
- [ ] put the service discovery / service publishing / service information (e.g. online, busy...) on the server side
- [ ] let the Android app set a Wifi hotspot
- [ ] let the Android app select a Wifi hostpot?
- [ ] Double check if server works correclty in background. Seems ok.
  - [nodejs plugin side](https://github.com/JaneaSystems/nodejs-mobile/issues/104) and [a dedicated plugin](https://github.com/katzer/cordova-plugin-background-mode).
- [ ] Share the apk. Options:
  - send the server url by SMS
  - print the server url on a QR code
- [ ] publish to the app store
- [ ] build and publish with GH Actions or another CI tool
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
