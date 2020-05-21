const express = require('express')
const path = require('path')
const { ExpressPeerServer } = require('peer')
const log = require('./log')

module.exports = function(
  port = 3000,
  listenCallback = () => {
    log(`App listening at http://0.0.0.0:${port}`)
  }
) {
  const app = express()
  app.use(express.static(path.join(__dirname, 'client')))
  //   log('Static client middleware loaded.')

  const server = app.listen(port, listenCallback)

  const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: '/'
  })
  //   log('Peer server created.')

  app.use('/', peerServer)
  //   log('PeerJS middleware loaded.')

  //   const router = express.Router()
  //   router.get('/turn', (req, res) => {
  //     res.json({ host: 'localhost', port: 3000, path: '/peerjs', secure: false })
  //   })

  //   app.use('/api', router)
}
