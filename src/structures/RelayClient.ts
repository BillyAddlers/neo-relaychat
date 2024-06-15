import chalk from 'chalk'
import { protocol, url, port } from './../../config.json'
import { version } from './../../package.json'
import { ChatCore } from './ChatCore'
import { io, Socket } from 'socket.io-client'

const serverUrl = `${protocol}://${url}:${port}`

process.stdin.resume()

const array =
[ `  OOOO     WW            WW     OOOO   `,
  `OO    OO   WW            WW   OO    OO `,
  `OO    OO    WW          WW    OO    OO `,
  `OO    OO     WW   WW   WW     OO    OO `,
  `OO    OO      WW W  W WW      OO    OO `,
  `  OOOO          W    W          OOOO   `,
  `                                       `,
  `  Starting a Relay Client...           `,
  `  version ${version}       `,
  `  Running a subset of Relay Task...    `,
  `                                       `]

array.forEach((i) => console.log(i))

const socket = io(serverUrl)
const client = new ChatCore(socket)

socket.on('messageReceived', (username: string, response: string) => {
  client.printChat(username, response)
})

var state: string = ''
var username: string = ''

client.getSocket().on('userLeave', (response) => {
  if (response !== username) console.log(`${response} is disconnected from Relay!`)
})
client.getSocket().on('userJoin', (response) => {
  if (response !== username) console.log(`${response} is connected to the Relay!`)
})

process.stdin.on('data', (data) => {
  process.stdout.write('> ')
  client.emit(state, data.toString().trim())
})

client.on(':start', (name, prompt) => {
  state = name
  console.log(prompt)
})
client.on(':end', () => {
  console.log('\n', `You're disconnected from the Relay!`)
  socket.emit('disconnected', username)
  process.stdin.pause()
})
client.emit(':start', 'login', 'Type your username')

client.on('login', (response) => {
  username = response
  state = 'messenger'
  client.emit(':start', 'messenger', `You're connected as ${username}!`)
  socket.emit('login', username)
})
client.on('messenger', (response) => {
  if (response !== 'disconnect') {
    socket.emit('messageSend', username, response)
  } else {
    client.emit(':end')
  }
})

