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

## Challenges

- let the Android app set a Wifi hotspot
- captive portal
- change the device hostname (may require root access)
- change the express server port to 80 (requires root access)
- SSL?
- find a way to use mDNS/zeroconf service in the browser
- Double check if server works correclty in background. [nodejs plugin side](https://github.com/JaneaSystems/nodejs-mobile/issues/104) and [a dedicated plugin](https://github.com/katzer/cordova-plugin-background-mode).
