import { verify } from 'jsonwebtoken'
import { Server } from 'ws'
import { AesCryptoAdapterInterface } from '../../../helpers/adapters/aesCrypto'
import { ExchangeRepositoryInterface } from '../interfaces/exchange-interface'
import { UsersRepositoryInterface } from './../../users/interfaces/users-interface'

interface PayloadInterface {
  sub: string
}

export class ExchangeMonitorUseCase {
  constructor (
    private readonly userProtocol: string,
    private readonly websocketServer: Server,
    private readonly aesCrypto: AesCryptoAdapterInterface,
    private readonly exchangeRepository: ExchangeRepositoryInterface,
    private readonly usersRepository: UsersRepositoryInterface
  ) { }

  private broadcast (data: Object): void {
    if (!this.websocketServer || !this.websocketServer.clients) return

    this.websocketServer.clients.forEach(client => {
      if (client.OPEN && client.protocol === this.userProtocol) {
        client.send(JSON.stringify(data))
      }
    })
  }

  async execute (): Promise<void> {
    const { sub: userId } = verify(this.userProtocol, process.env.SECRET as string) as PayloadInterface

    const user = await this.usersRepository.findById({ id: userId })

    if (user) {
      const settings = {
        APIKEY: user.accessKey,
        APISECRET: this.aesCrypto.decrypt(user.secretKey),
        urls: {
          base: user.apiURL,
          stream: user.streamURL
        }
      }

      await this.exchangeRepository.setSettings(settings)

      await this.exchangeRepository.miniTickerStream((market) => {
        this.broadcast({ market })
      })

      const book: any[] = []
      await this.exchangeRepository.bookTickersStream((order) => {
        if (book.length === 100) {
          this.broadcast({ book })
          book.length = 0
        } else {
          book.push(order)
        }
      })

      await this.exchangeRepository.userDataStream(
        balance => this.broadcast({ balance }),
        execution => console.log(execution),
        listStatus => console.log(listStatus)
      )
    }
  }
}
