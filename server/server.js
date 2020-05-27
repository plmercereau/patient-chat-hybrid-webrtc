const express = require('express')
var cors = require('cors')
const path = require('path')
const { ExpressPeerServer } = require('peer')
const log = require('./log')
log('Express Server Loader')

module.exports = function(
  port = 3000,
  listenCallback = () => {
    log(`App listening at http://0.0.0.0:${port}`)
  }
) {
  log('Starting Express')
  const app = express()
  app.use(cors())
  app.get('/healthz', (req, res) => res.status(200).send('OK'))

  //   app.use(express.static(path.join(__dirname, 'client')))
  //   log('Static client middleware loaded.')

  const server = app.listen(port, listenCallback)

  const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: '/',
    allow_discovery: true
  })
  log('Peer server created.')

  app.use('/', peerServer)
  log('PeerJS middleware loaded.')

  //   const router = express.Router()
  //   router.get('/turn', (req, res) => {
  //     res.json({ host: 'localhost', port: 3000, path: '/peerjs', secure: false })
  //   })

  //   app.use('/api', router)
}
