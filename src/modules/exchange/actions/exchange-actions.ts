import { NodeBinanceApiAdapterInterface, OutputBalanceInterface, OutputExecutionReportInterface, OutputMiniTickerStream, OutputOHLCInterface, SettingsInterface } from '../../../helpers/adapters/nodeBinanceApi/interfaces/nodeBinanceApi-Interface'
import { InputUpdateOrdersInterface, OrdersRepositoryInterface } from '../../orders/interfaces/orders-interface'
import { ExchangeActionsInterface, InputStartChartMonitorInterface, InputStartMiniTickerMonitorInterface, InputStartUserDataMonitorInterface } from './../interfaces/exchange-interface'

interface InputProcessChartInterface {
  symbol: string
  interval: string
  indexes: string[]
  ohlc: OutputOHLCInterface
}

export class ExchangeActions implements ExchangeActionsInterface {
  constructor (
    private readonly nodeBinanceApiAdapter: NodeBinanceApiAdapterInterface,
    private readonly ordersRepository: OrdersRepositoryInterface
  ) { }

  private async loadWallet (settings: SettingsInterface): Promise<any> {
    const balance = await this.nodeBinanceApiAdapter.exchangeBalance(settings).catch(err => console.error(err))

    const balanceWallet = Object.entries(balance as OutputBalanceInterface).map(([key, value]) => {
      return {
        symbol: key,
        available: value.available,
        onOrder: value.onOrder
      }
    })

    return balanceWallet
  }

  private async processChart (data: InputProcessChartInterface): Promise<void> {
    console.log(data.symbol)
  }

  async startMiniTickerMonitor (data: InputStartMiniTickerMonitorInterface): Promise<void> {
    const { showLogs, broadcastLabel, broadcast, settings } = data

    await this.nodeBinanceApiAdapter.miniTickerStream((market) => {
      if (showLogs) console.log(market)

      if (broadcastLabel) broadcast({ [broadcastLabel]: market })

      const book = Object.entries(market as OutputMiniTickerStream).map(([key, value]) => {
        return { symbol: key, bestAsk: value.close, bestBid: value.close }
      })

      if (broadcastLabel) broadcast({ bookStream: book })
    }, settings)

    console.log(`Mini Ticker monitor has started at ${broadcastLabel ?? ''}`)
  }

  async startUserDataMonitor (data: InputStartUserDataMonitorInterface): Promise<void> {
    const { userId, showLogs, broadcastLabel, direct, settings } = data

    const [balanceStream, executionStream] = broadcastLabel.split(',')

    await this.nodeBinanceApiAdapter.userDataStream(
      (data) => {
        if (showLogs) console.log(data)

        if (data.e === 'outboundAccountPosition') {
          this.loadWallet(settings)
            .then((balance) => {
              direct(userId, { [balanceStream]: balance })
            })
            .catch(err => console.error(err))
        }

        if (data.e === 'executionReport') {
          const execution: OutputExecutionReportInterface = data

          new Promise<void>((resolve) => {
            setTimeout(async () => {
              if (execution.x === 'NEW') return

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

              const order = await this.ordersRepository.update(orderUpadte).catch(err => direct(userId, { error: err }))
              direct(userId, { [executionStream]: order })

              return resolve()
            }, 1000)
          }).catch(err => console.log(err))
        }
      },
      true,
      listStatus => console.log(listStatus),
      settings
    )

    console.log(`User Data monitor by userId:${userId} has started at ${broadcastLabel ?? ''}`)
  }

  async startChartMonitor (data: InputStartChartMonitorInterface): Promise<void> {
    const { userId, symbol, interval, indexes, showLogs, broadcastLabel, direct, settings } = data

    await this.nodeBinanceApiAdapter.chartStream({
      settings,
      symbol,
      interval,
      callback: async (ohlc: OutputOHLCInterface) => {
        const lastCandle = {
          open: ohlc.open[ohlc.open.length - 1],
          close: ohlc.close[ohlc.close.length - 1],
          high: ohlc.high[ohlc.high.length - 1],
          low: ohlc.low[ohlc.low.length - 1]
        }

        if (showLogs) console.log(lastCandle)

        if (broadcastLabel) direct(userId, lastCandle)

        const indexesArray = indexes.split(',')

        await this.processChart({ symbol, interval, indexes: indexesArray, ohlc })
      }
    })

    console.log(`Chart monitor by userId:${userId} has started at ${symbol}_${interval} `)
  }
}
