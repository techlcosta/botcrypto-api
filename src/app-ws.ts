import { decode, verify } from 'jsonwebtoken'
import WebSocket, { Server } from 'ws'
import { UsersRepositoryInterface } from './modules/users/interfaces/users-interface'

interface PayloadInterface {
  sub: string
}

export interface WebSocketServerInterface {
  execute: (server: any) => Promise<WebSocket.Server<WebSocket.WebSocket>>
  broadcast: (data: Object) => void
  direct: (userId: string, data: Object) => void
}

export class WebSocketServer implements WebSocketServerInterface {
  private wss: WebSocket.Server<WebSocket.WebSocket> | undefined
  constructor (
    private readonly usersRepository: UsersRepositoryInterface
  ) { }

  broadcast (data: Object): void {
    if (!this.wss || !this.wss.clients) return
    this.wss.clients.forEach((client) => {
      if (client.OPEN) client.send(JSON.stringify(data))
    })
  }

  direct (userId: string, data: Object): void {
    if (!this.wss || !this.wss.clients) return
    this.wss.clients.forEach((client) => {
      const { sub: clientId } = decode(client.protocol) as PayloadInterface
      if (client.OPEN && clientId === userId)client.send(JSON.stringify(data))
    })
  }

  async execute (server: any): Promise < WebSocket.Server < WebSocket.WebSocket >> {
    this.wss = new Server({
      server,
      verifyClient: async (info, callback) => {
        try {
          const authToken = info.req.headers['sec-websocket-protocol']
          if (!authToken) {
            callback(false, 401, 'Unauthorized')
          } else {
            if (!info.origin.includes(process.env.CORS_ORIGIN as string)) callback(false, 401, 'Unauthorized')

            const { sub: userId } = verify(authToken, process.env.SECRET as string) as PayloadInterface

            info.req.userId = userId

            const user = await this.usersRepository.findById({ id: userId })

            if (!user) {
              callback(false, 401, 'Unauthorized')
            } else {
              callback(true)
            }
          }
        } catch (error) {
          console.error(error)
          callback(false, 401, 'Unauthorized')
        }
      }
    })

    this.wss.on('connection', async (socket, request) => {
      socket.on('message', (data) => console.log(data))
      socket.on('error', (err) => console.error(err))
      console.log('onConnection')
    })

    return this.wss
  }
}
