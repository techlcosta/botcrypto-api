
import { UserDataStreamEvent } from 'binance-api-node'
import { BinanceApiNodeAdapterInterface } from '../../../helpers/adapters/binanceApiNode/binanceApiNode-interface'
import { NodeBinanceApiAdapterInterface, OutputOHLCInterface, SettingsInterface } from '../../../helpers/adapters/nodeBinanceApi/nodeBinanceApi-Interface'
import { AppError } from '../../../helpers/errors/appError'
import { InputUpdateOrdersInterface, OrdersRepositoryInterface } from '../../orders/interfaces/orders-interface'
import { RobotRepositoryInterface } from '../../robot/interfaces/robot-interface'
import { ExchangeActionsInterface, InputStartChartMonitorInterface, InputStartMiniTickerMonitorInterface, InputStartTickerMonitorInterface, InputStartUserDataMonitorInterface } from './../interfaces/exchange-interface'
interface InputProcessChartInterface {
  symbol: string
  interval: string
  indexes: string[]
  ohlc: OutputOHLCInterface
}

type InputOnExecutionType = InputStartUserDataMonitorInterface

export class ExchangeActions implements ExchangeActionsInterface {
  constructor (
    private readonly nodeBinanceApiAdapter: NodeBinanceApiAdapterInterface,
    private readonly binanceApiNodeAdapter: BinanceApiNodeAdapterInterface,
    private readonly ordersRepository: OrdersRepositoryInterface,
    private readonly robotRepository: RobotRepositoryInterface

  ) {}

  private async loadWallet (settings: SettingsInterface): Promise<any> {
    const balance = await this.binanceApiNodeAdapter.exchangeBalance(settings).catch(err => { throw new AppError(err.message || err.body) })

    const balanceWallet = balance.balances.map((value) => {
      return {
        symbol: value.asset,
        available: value.free,
        onOrder: value.locked
      }
    })

    return balanceWallet
  }

  private async processChart (data: InputProcessChartInterface): Promise<void> {
    console.log(data.ohlc)
  }

  private async onExecution (execution: UserDataStreamEvent, data: InputOnExecutionType): Promise<void> {
    const { userId, broadcastLabel, showLogs, direct, settings } = data

    const [balanceStream, executionStream] = broadcastLabel.split(',')

    if (execution.eventType === 'outboundAccountPosition') {
      this.loadWallet(settings)
        .then((balance) => {
          direct(userId, { [balanceStream]: balance })
        })
        .catch(err => console.error(err))
    }

    if (execution.eventType === 'executionReport') {
      if (showLogs) console.log(execution)
      new Promise<void>((resolve) => {
        setTimeout(async () => {
          if (execution.executionType === 'NEW') return

          const clientOrderId = execution.orderStatus === 'CANCELED' ? (execution.originalClientOrderId as string) : execution.newClientOrderId

          const alredyExists = await this.ordersRepository.findByOrderIdAndClieantId({ userId, clientOrderId, orderId: execution.orderId })

          if (!alredyExists) return

          const orderUpadte: InputUpdateOrdersInterface = {
            clientOrderId,
            quantity: execution.quantity,
            side: execution.side,
            type: execution.orderType,
            status: execution.orderStatus !== alredyExists.status && (alredyExists.status === 'NEW' || alredyExists.status === 'PARTIALLY_FILLED') ? execution.orderStatus : alredyExists.status,
            isMaker: execution.isBuyerMaker,
            transactionTime: String(execution.orderTime)
          }

          if (execution.orderType !== 'MARKET') orderUpadte.limitPrice = execution.price

          if (execution.orderStatus === 'FILLED') {
            const quoteAmount = parseFloat(execution.totalQuoteTradeQuantity)
            orderUpadte.avgPrice = String((quoteAmount / parseFloat(execution.totalTradeQuantity)))
            orderUpadte.comission = execution.commission
            const isQuoteComission = execution.commissionAsset && execution.symbol.endsWith(execution.commissionAsset)
            orderUpadte.net = isQuoteComission ? String((quoteAmount - parseFloat(execution.commission))) : String(quoteAmount)
            orderUpadte.status = execution.orderStatus
          }

          if (execution.orderStatus === 'REJECTED') orderUpadte.obs = execution.orderRejectReason

          const order = await this.ordersRepository.update(orderUpadte).catch(err => direct(userId, { error: err }))
          direct(userId, { [executionStream]: order })

          return resolve()
        }, 1000)
      }).catch(err => console.log(err))
    }
  }

  async startMiniTickerMonitor (data: InputStartMiniTickerMonitorInterface): Promise<void> {
    const { showLogs, broadcastLabel, broadcast } = data

    await this.binanceApiNodeAdapter.miniTickerStream(async (market) => {
      const miniTicker = market.reduce((acc, current) => {
        return { ...acc, [current.symbol]: current }
      }, {})

      if (showLogs) console.log(miniTicker)

      if (broadcastLabel) broadcast({ [broadcastLabel]: miniTicker })

      for (const item of market) {
        await this.robotRepository.updateRobotMemory({ symbol: item.symbol, index: 'MINI_TICKER', value: item }).catch(err => console.log(err))
      }
    })

    console.log(`Mini Ticker monitor has started at ${broadcastLabel ?? ''}`)
  }

  async startTickerAndBookMonitor (data: InputStartTickerMonitorInterface): Promise<void> {
    const { showLogs, broadcastLabel, broadcast } = data

    const [ticker, books] = broadcastLabel?.split(',')

    await this.binanceApiNodeAdapter.tickerStream(async (market) => {
      if (showLogs) console.log(market)

      broadcast({ [ticker]: market })

      for (const item of market) {
        this.robotRepository.updateRobotMemory({ symbol: item.symbol, index: 'TICKER', value: item }).catch(err => console.log(err))

        const book = { symbol: item.symbol, bestAsk: item.bestAsk, bestBid: item.bestBid }

        broadcast({ [books]: book })
      }
    })

    console.log(`Ticker and Book monitor has started at ${broadcastLabel ?? ''}`)
  }

  async startUserDataMonitor (data: InputStartUserDataMonitorInterface): Promise<void> {
    await this.binanceApiNodeAdapter.userDataStream({
      settings: data.settings,
      callback: async (execution) => await this.onExecution(execution, data)
    })

    console.log(`User Data monitor by userId:${data.userId} has started at ${data.broadcastLabel ?? ''}`)
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
