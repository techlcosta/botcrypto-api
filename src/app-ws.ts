
import { verify } from 'jsonwebtoken'
import WebSocket, { Server } from 'ws'
import { ExchangeMonitorController } from './modules/exchange/controllers/exchangeMonitor-controller'
import { UsersRepository } from './modules/users/repositories/users-repository'

interface PayloadInterface {
  sub: string
}

export function WebSocketServer (server: any): Server<WebSocket> {
  const wss = new Server({
    server,
    verifyClient: async function (info, callback) {
      try {
        const authToken = info.req.headers['sec-websocket-protocol']
        if (!authToken) {
          callback(false, 401, 'Unauthorized')
        } else {
          // if (!info.origin.includes(process.env.CORS_ORIGIN as string)) callback(false, 401, 'Unauthorized')

          const { sub: userId } = verify(authToken, process.env.SECRET as string) as PayloadInterface

          const usersRepository = new UsersRepository()

          const user = await usersRepository.findById({ id: userId })

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

  wss.on('connection', async (socket) => {
    const exchangeMonitor = new ExchangeMonitorController()

    await exchangeMonitor.handle({ userProtocol: socket.protocol, wssServer: wss })

    socket.on('message', (data) => console.log(data))
    socket.on('error', (err) => console.error(err))
    console.log('onConnection')
  })
  return wss
}
