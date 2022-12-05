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
      this.broadcast({ miniTickerStream: market })
    })

    const book: any[] = []
    await this.exchangeRepository.bookTickersStream((order) => {
      if (book.length === 100) {
        this.broadcast({ bookTickersStream: book })
        book.length = 0
      } else {
        book.push(order)
      }
    })

    await this.exchangeRepository.userDataStream(
      async (callback) => {
        // console.log(callback)

        if (callback.e === 'outboundAccountPosition') return this.broadcast({ balance: callback })

        if (callback.e === 'executionReport') {
          await this.waitOneSecond()

          const execution: ExecutionReportInterface = callback

          if (execution.x !== 'NEW') {
            const clientOrderId = execution.X === 'CANCELED' ? execution.C : execution.c

            const alredyExists = await this.ordersRepository.findByOrderIdAndClieantId({ orderId: execution.i, clientOrderId })

            if (alredyExists) {
              const orderUpadte: InputUpdateOrdersInterface = {
                clientOrderId,
                quantity: execution.q,
                side: execution.S,
                type: execution.o,
                status: execution.X,
                isMaker: execution.m,
                transactionTime: String(execution.T)
              }

              if (execution.o !== 'MARKET') orderUpadte.limitPrice = execution.p

              if (execution.X === 'FILLED') {
                const quoteAmount = parseFloat(execution.Z)
                orderUpadte.avgPrice = (quoteAmount / parseFloat(execution.z)).toFixed(2)
                orderUpadte.comission = execution.n
                const isQuoteComission = execution.N && execution.s.endsWith(execution.N)
                orderUpadte.net = isQuoteComission ? (quoteAmount - parseFloat(execution.n)).toFixed(2) : quoteAmount.toFixed(2)
                orderUpadte.status = execution.X
              }

              if (execution.X === 'REJECTED') orderUpadte.obs = execution.r

              const order = await this.ordersRepository.update(orderUpadte)

              this.broadcast({ execution: order })
            }
          }
        }
      },
      true,
      listStatus => console.log(listStatus)
    )
  }
}
