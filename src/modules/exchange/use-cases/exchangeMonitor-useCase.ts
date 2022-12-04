import { verify } from 'jsonwebtoken'
import { Server } from 'ws'
import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'
import { InputUpdateOrdersInterface, OrdersRepositoryInterface } from '../../orders/interfaces/orders-interface'
import { ExchangeRepositoryInterface } from '../interfaces/exchange-interface'
import { ExecutionReportInterface } from './../interfaces/exchange-interface'

interface PayloadInterface {
  sub: string
}

export class ExchangeMonitorUseCase {
  constructor (
    private readonly userProtocol: string,
    private readonly websocketServer: Server,
    private readonly getSettingsDecrypted: GetSettingsDecryptedInterface,
    private readonly exchangeRepository: ExchangeRepositoryInterface,
    private readonly ordersRepository: OrdersRepositoryInterface

  ) { }

  private broadcast (data: Object): void {
    if (!this.websocketServer || !this.websocketServer.clients) return

    this.websocketServer.clients.forEach(client => {
      if (client.OPEN && client.protocol === this.userProtocol) {
        client.send(JSON.stringify(data))
      }
    })
  }

  private async waitOneSecond (): Promise<void> {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        return resolve()
      }, 1000)
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
      async (callback: ExecutionReportInterface) => {
        if (callback.e === 'outboundAccountPosition') return this.broadcast({ balance: callback })

        if (callback.e === 'executionReport') {
          await this.waitOneSecond()

          if (callback.X !== 'NEW') {
            const clientOrderId = callback.X === 'CANCELED' ? callback.C : callback.c

            const alredyExists = await this.ordersRepository.findByOrderIdAndClieantId({ orderId: callback.i, clientOrderId })

            if (alredyExists) {
              const orderUpadte: InputUpdateOrdersInterface = {
                clientOrderId,
                quantity: callback.q,
                side: callback.S,
                type: callback.o,
                status: callback.X,
                isMaker: callback.m,
                transactionTime: String(callback.T)
              }

              if (callback.o !== 'MARKET') orderUpadte.limitPrice = callback.p

              if (callback.X === 'FILLED') {
                const quoteAmount = parseFloat(callback.Z)
                orderUpadte.avgPrice = String(quoteAmount / parseFloat(callback.z))
                orderUpadte.comission = callback.n
                const isQuoteComission = callback.N && callback.s.endsWith(callback.N)
                orderUpadte.net = isQuoteComission ? String(quoteAmount - parseFloat(callback.n)) : String(quoteAmount)
              }

              if (callback.X === 'REJECTED') orderUpadte.obs = callback.r

              await this.ordersRepository.update(orderUpadte)

              this.broadcast({ execution: callback })
            }
          }

          console.log(callback)
        }
      },
      true,
      listStatus => console.log(listStatus)
    )
  }
}
