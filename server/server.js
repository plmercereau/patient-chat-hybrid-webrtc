const express = require('express')
const path = require('path')
const { ExpressPeerServer } = require('peer')
const https = require('https')
const selfsigned = require('selfsigned')
const log = require('./log')

module.exports = function(port = 3000) {
  var attrs = [{ name: 'commonName', value: 'pocophonef1-pocophon' }]
  var pems = selfsigned.generate(attrs, { days: 365 })
  console.log(pems)

  const app = express()
  app.use(express.static(path.join(__dirname, 'client')))
  log('Static client middleware loaded.')

  // we will pass our 'app' to 'https' server
  const server = https
    .createServer(
      {
        key: perms.private,
        cert: perms.cert
        // passphrase: 'YOUR PASSPHRASE HERE'
      },
      app
    )
    .listen(port, () => {
      log(`App listening at http://0.0.0.0:${port}`)
    })

  //   const server = app.listen(port, () => {
  //     log(`App listening at http://0.0.0.0:${port}`)
  //   })

  const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: '/'
  })
  log('Peer server created.')

  app.use('/', peerServer)
  log('PeerJS middleware loaded.')

  const router = express.Router()
  router.get('/turn', (req, res) => {
    res.json({ host: 'localhost', port: 3000, path: '/peerjs', secure: false })
  })

  app.use('/api', router)
}
