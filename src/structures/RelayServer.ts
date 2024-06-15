import chalk from 'chalk'
import express, { Express, Request, Response } from 'express'
import { url, port } from './../../config.json'
import { version } from './../../package.json'
import { Server } from 'socket.io'

const app: Express = express()
const usedPort = process.env.PORT || port || 5000

const array =
[ `  OOOO     WW            WW     OOOO   `,
  `OO    OO   WW            WW   OO    OO `,
  `OO    OO    WW          WW    OO    OO `,
  `OO    OO     WW   WW   WW     OO    OO `,
  `OO    OO      WW W  W WW      OO    OO `,
  `  OOOO          W    W          OOOO   `,
  `                                       `,
  `  Starting a Relay Server...           `,
  `  version ${version}       `,
  `  Running a subset of Relay Task...    `,
  `                                       `]

array.forEach((i) => console.log(i))

const server = app.listen(usedPort, () => {
  console.log('Relay server is running on port ' + usedPort)
})

app.get('/', (req, res) => {
  res.sendStatus(200)
})

const io = new Server().listen(server)

io.on('connection', (socket) => {
  socket.on('login', (response) => {
    console.log(response + ' is connected to the Relay!')
    socket.broadcast.emit('userJoin', response)
  })

  socket.on('messageSend', (username, response) => {
    socket.broadcast.emit('messageReceived', username, response)
  })

  socket.on('disconnected', (response) => {
    console.info(response + ' is disconnected from Relay!')
    socket.broadcast.emit('userLeave', response)
  })
})

