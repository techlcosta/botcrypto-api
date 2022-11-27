import { app } from './app'
import { WebSocketServer } from './app-ws'

export const server = app.listen(process.env.PORT, () => {
  console.log(`server is running! ${process.env.PORT as string}`)
})

WebSocketServer(server)
