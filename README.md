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

## TODO

### Top priorities

- SSL / unable to run video in insecure contexts
  - Temporary workaround: whitelist http://<hostname>:3000 by opening chrome://flags and search for unsafely-treat-insecure-origin-as-secure
  - check if a self-signed certificate would work
    1. https://github.com/jfromaniello/selfsigned#readme
    2. https://github.com/JaneaSystems/nodejs-mobile/issues/165
    3. https://flaviocopes.com/express-https-self-signed-certificate/
  - https://w3c.github.io/webappsec-secure-contexts/
  - https://medium.com/@bramus/on-secure-contexts-in-firefox-https-for-local-development-and-a-potential-nice-gesture-by-cea4ab4903a
  - Let's encrypt would require an internet connection

### Other

- let the Android app set a Wifi hotspot
- serve the SPA through a captive portal (may require root access)
- change the device hostname (may require root access)
- change the express server port to 80 (requires root access)
- find a way to use mDNS/zeroconf service in the browser
- Double check if server works correclty in background. Seems ok.
  - [nodejs plugin side](https://github.com/JaneaSystems/nodejs-mobile/issues/104) and [a dedicated plugin](https://github.com/katzer/cordova-plugin-background-mode).
- send the server url by SMS
- print the server url on a QR code
- publish to the app store
