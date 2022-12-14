import { UserDataStreamEvent } from 'binance-api-node'
import { IndexesTypesEnum, IndexesTypesType, SettingsInterface } from '../../../dtos/dtos'
import { BinanceApiNodeAdapterInterface } from '../../../helpers/adapters/binanceApiNode/binanceApiNode-interface'
import { NodeBinanceApiAdapterInterface, OutputOHLCInterface } from '../../../helpers/adapters/nodeBinanceApi/nodeBinanceApi-Interface'
import { TechnicalIndicatorsAdapterInterface } from '../../../helpers/adapters/technicalIndicators/technicalIndicators-interface'
import { InputUpdateOrdersInterface, OrdersRepositoryInterface } from '../../orders/interfaces/ordersRepository-interface'
import { RobotRepositoryInterface } from '../../robot/interfaces/robot-interface'
import { InputStartChartMonitorInterface, InputStartMiniTickerMonitorInterface, InputStartTickerMonitorInterface, InputStartUserDataMonitorInterface, MonitorsActionsInterface, StopChartMonitorInterface } from '../interfaces/monitorsActions-interface'

interface InputProcessChartInterface {
  symbol: string
  interval: string
  indexes: string[]
  userId: string
  ohlc: OutputOHLCInterface
}

interface OutputWalletInterface {
  symbol: string
  available: string
  onOrder: string

}

type InputOnExecutionType = InputStartUserDataMonitorInterface

export class MonitorsActions implements MonitorsActionsInterface {
  constructor (
    private readonly nodeBinanceApiAdapter: NodeBinanceApiAdapterInterface,
    private readonly binanceApiNodeAdapter: BinanceApiNodeAdapterInterface,
    private readonly ordersRepository: OrdersRepositoryInterface,
    private readonly robotRepository: RobotRepositoryInterface,
    private readonly technicalIndicatorsAdapter: TechnicalIndicatorsAdapterInterface
  ) { }

  private async loadWallet (settings: SettingsInterface, userId: string): Promise<OutputWalletInterface[]> {
    const balance = await this.binanceApiNodeAdapter.exchangeBalance(settings)

    const balanceWallet = balance.balances.map((value) => {
      return { symbol: value.asset, available: value.free, onOrder: value.locked }
    })

    for (const balance of balanceWallet) {
      await this.robotRepository.updateRobotMemory({ symbol: balance.symbol, userId, index: 'WALLET', value: balance.available })
    }

    return balanceWallet
  }

  private async processChart (data: InputProcessChartInterface): Promise<void> {
    const { userId, symbol, interval, indexes, ohlc } = data

    for (const target of indexes) {
      const [index, params] = target.split('_')

      switch (index) {
        case IndexesTypesEnum.RSI:
          await (async (): Promise<void> => {
            const value = await this.technicalIndicatorsAdapter.rsiCalc({ period: Number(params), values: ohlc.close })

            await this.robotRepository.updateRobotMemory({ userId, symbol, index, interval, value })
          })()
          break

        case IndexesTypesEnum.MACD:
          await (async (): Promise<void> => {
            const paramsArray = params.split('.')

            const [fastPeriod, slowPeriod, signalPeriod] = paramsArray.map(item => Number(item))

            const value = await this.technicalIndicatorsAdapter.macdCalc({ fastPeriod, slowPeriod, signalPeriod, values: ohlc.close })

            await this.robotRepository.updateRobotMemory({ userId, symbol, index, interval, value })
          })()
          break

        case IndexesTypesEnum.SMA:
          await (async (): Promise<void> => {
            const value = await this.technicalIndicatorsAdapter.smaCalc({ period: Number(params), values: ohlc.close })

            await this.robotRepository.updateRobotMemory({ userId, symbol, index, interval, value })
          })()
          break

        case IndexesTypesEnum.EMA:
          await (async (): Promise<void> => {
            const value = await this.technicalIndicatorsAdapter.emaCalc({ period: Number(params), values: ohlc.close })

            await this.robotRepository.updateRobotMemory({ userId, symbol, index, interval, value })
          })()
          break

        case IndexesTypesEnum.BOLLINGER_BANDS:
          await (async (): Promise<void> => {
            const paramsArray = params.split('.')

            const [period, stdDev] = paramsArray.map(item => Number(item))

            const value = await this.technicalIndicatorsAdapter.bollingerBandsCalc({ period, stdDev, values: ohlc.close })

            await this.robotRepository.updateRobotMemory({ userId, symbol, index, interval, value })
          })()
          break

        case IndexesTypesEnum.STOCH_RSI:
          await (async (): Promise<void> => {
            const paramsArray = params.split('.')

            const [rsiPeriod, stochasticPeriod, kPeriod, dPeriod] = paramsArray.map(item => Number(item))

            const value = await this.technicalIndicatorsAdapter.stochRSICalc({ rsiPeriod, stochasticPeriod, kPeriod, dPeriod, values: ohlc.close })

            await this.robotRepository.updateRobotMemory({ userId, symbol, index, interval, value })
          })()
          break

        default:
          break
      }
    }

    const LAST_CANDLE = {
      open: ohlc.open[ohlc.open.length - 1],
      close: ohlc.close[ohlc.close.length - 1],
      high: ohlc.high[ohlc.high.length - 1],
      low: ohlc.low[ohlc.low.length - 1]
    }

    await this.robotRepository.updateRobotMemory({ symbol, userId, interval, index: 'LAST_CANDLE', value: LAST_CANDLE })
  }

  private async onExecution (execution: UserDataStreamEvent, data: InputOnExecutionType): Promise<void> {
    const { userId, broadcastLabel, showLogs, direct, settings } = data

    const [balanceStream, executionStream] = broadcastLabel.split(',')

    if (execution.eventType === 'outboundAccountPosition') {
      const balances = await this.loadWallet(settings, userId)

      direct(userId, { [balanceStream]: balances })
    }

    if (execution.eventType === 'executionReport') {
      if (showLogs) console.log(execution)
      await new Promise<void>((resolve) => {
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

          const order = await this.ordersRepository.update(orderUpadte)

          await this.robotRepository.updateRobotMemory({ symbol: order.symbol, userId: order.userId, index: 'LAST_ORDER', value: order })

          direct(userId, { [executionStream]: order })

          return resolve()
        }, 1000)
      })
    }
  }

  // Actions function *********************************************************************

  async clearCache (): Promise<void> {
    await this.robotRepository.clearAllOnRobotMemory()

    console.log('Cache has empty!')
  }

  async startMiniTickerMonitor (data: InputStartMiniTickerMonitorInterface): Promise<void> {
    const { showLogs, broadcastLabel, broadcast } = data

    await this.binanceApiNodeAdapter.miniTickerStream(async (market) => {
      let miniTicker: { [key: string]: object } = {}

      for (const item of market) {
        miniTicker = { ...miniTicker, ...{ [item.symbol]: item } }
        await this.robotRepository.updateRobotMemory({ symbol: item.symbol, index: 'MINI_TICKER', value: item })
      }

      if (showLogs) console.log(miniTicker)

      if (broadcastLabel) broadcast({ [broadcastLabel]: miniTicker })
    })

    console.log(`Mini Ticker monitor has started at ${broadcastLabel ?? ''}`)
  }

  async startTickerAndBookMonitor (data: InputStartTickerMonitorInterface): Promise<void> {
    const { showLogs, broadcastLabel, broadcast } = data

    const [ticker, books] = broadcastLabel?.split(',') as IndexesTypesType[]

    const bookCache: Array<{ symbol: string, bestAsk: number, bestBid: number, eventTime: number }> = []

    await this.binanceApiNodeAdapter.tickerStream(async (market) => {
      if (showLogs) console.log(market)

      broadcast({ [ticker]: market })

      for (const item of market) {
        await this.robotRepository.updateRobotMemory({ symbol: item.symbol, index: 'TICKER', value: item })

        const book = { symbol: item.symbol, bestAsk: parseFloat(item.bestAsk), bestBid: parseFloat(item.bestBid), eventTime: item.eventTime }

        await this.robotRepository.updateRobotMemory({ symbol: book.symbol, index: 'BOOK', value: book })

        bookCache.push(book)
      }

      broadcast({ [books]: { ...bookCache } })

      bookCache.length = 0
    })

    console.log(`Ticker and Book monitor has started at ${broadcastLabel ?? ''}`)
  }

  async startUserDataMonitor (data: InputStartUserDataMonitorInterface): Promise<void> {
    await this.loadWallet(data.settings, data.userId)

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
        if (showLogs) console.log(ohlc)

        if (broadcastLabel) direct(userId, ohlc)

        const indexesArray = indexes.split(',')

        await this.processChart({ symbol, interval, indexes: indexesArray, ohlc, userId })
      }
    })

    console.log(`Chart monitor by userId:${userId} has started at ${symbol}_${interval} `)
  }

  async stopChartMonitor ({ settings, userId, symbol, interval, indexes }: StopChartMonitorInterface): Promise<void> {
    await this.nodeBinanceApiAdapter.closeChartStream({ settings, symbol, interval }).catch(err => console.log(err))

    const converted: IndexesTypesType[] = []

    for (const value of indexes.split(',')) {
      converted.push(value.split('_')[0] as IndexesTypesType)
    }

    converted.push('LAST_CANDLE')

    for (const index of converted) {
      this.robotRepository.deleteKeyOnRobotMemory({ userId, symbol, interval, index }).catch(err => console.error(err))
    }

    console.log(`Chart monitor by userId:${userId} has stoped at ${symbol}_${interval} `)
  }
}
