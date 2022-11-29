import { verify } from 'jsonwebtoken'
import { Server } from 'ws'
import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'
import { ExchangeRepositoryInterface } from '../interfaces/exchange-interface'

interface PayloadInterface {
  sub: string
}

export class ExchangeMonitorUseCase {
  constructor (
    private readonly userProtocol: string,
    private readonly websocketServer: Server,
    private readonly getSettingsDecrypted: GetSettingsDecryptedInterface,
    private readonly exchangeRepository: ExchangeRepositoryInterface

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

    const settings = await this.getSettingsDecrypted.handle({ userId })

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
