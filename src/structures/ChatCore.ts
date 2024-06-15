import { EventEmitter } from 'events'
import chalk from 'chalk'
import { Socket } from "socket.io-client"

export class ChatCore extends EventEmitter {
  private socket: Socket
  private chatColor = chalk.green
  private nameColor = chalk.greenBright
  private logColor = chalk.magenta
  constructor (socket: Socket) {
    super()

    this.socket = socket
  }

  public getSocket () {
    return this.socket
  }

  public printChat (username: string, content: string) {
    const name = this.nameColor(username)
    const bordered_name = chalk.white(`[${name}]`)
    const chat = this.chatColor(content)
    const string = `${bordered_name}>> ${chat}`
    console.log(string)
  }

  public printLog (content: string) {
    console.log(this.logColor(content))
  }
}

