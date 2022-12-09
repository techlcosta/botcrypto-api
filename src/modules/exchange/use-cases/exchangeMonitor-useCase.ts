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
  private readonly queue: ExecutionReportInterface[] = []
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
      (callback) => {
        if (callback.e === 'outboundAccountPosition') return this.broadcast({ balanceStream: callback })

        if (callback.e === 'executionReport') {
          const execution: ExecutionReportInterface = callback

          new Promise<void>((resolve) => {
            setTimeout(async () => {
              if (execution.x === 'NEW') return

              console.log(execution, 'aqui')

              const clientOrderId = execution.X === 'CANCELED' ? execution.C : execution.c

              const alredyExists = await this.ordersRepository.findByOrderIdAndClieantId({ userId, clientOrderId, orderId: execution.i })

              if (!alredyExists) return

              const orderUpadte: InputUpdateOrdersInterface = {
                clientOrderId,
                quantity: execution.q,
                side: execution.S,
                type: execution.o,
                status: execution.X !== alredyExists.status && (alredyExists.status === 'NEW' || alredyExists.status === 'PARTIALLY_FILLED') ? execution.X : alredyExists.status,
                isMaker: execution.m,
                transactionTime: String(execution.T)
              }

              if (execution.o !== 'MARKET') orderUpadte.limitPrice = execution.p

              if (execution.X === 'FILLED') {
                const quoteAmount = parseFloat(execution.Z)
                orderUpadte.avgPrice = String((quoteAmount / parseFloat(execution.z)))
                orderUpadte.comission = execution.n
                const isQuoteComission = execution.N && execution.s.endsWith(execution.N)
                orderUpadte.net = isQuoteComission ? String((quoteAmount - parseFloat(execution.n))) : String(quoteAmount)
                orderUpadte.status = execution.X
              }

              if (execution.X === 'REJECTED') orderUpadte.obs = execution.r

              const order = await this.ordersRepository.update(orderUpadte).catch(err => this.broadcast({ error: err }))
              this.broadcast({ executionStream: order })

              return resolve()
            }, 1000)
          }).catch(err => console.log(err))
        }
      },
      true,
      listStatus => console.log(listStatus)
    )
  }
}
