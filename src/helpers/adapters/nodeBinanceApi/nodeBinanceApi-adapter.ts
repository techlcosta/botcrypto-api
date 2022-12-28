import Binance from 'node-binance-api'
import { SettingsInterface } from '../../../dtos/dtos'
import { InputChartStreamInterface, InputCloseChartStream, InputOrderStatusInterface, InputOrderTradeInterface, NodeBinanceApiAdapterInterface, OutputOHLCInterface, OutputOrderStatusInterface, OutputOrdertradeInterface } from './nodeBinanceApi-Interface'

export class NodeBinanceApiAdapter implements NodeBinanceApiAdapterInterface {
  private static readonly publicBinance: Binance = new Binance()

  private static readonly privateInstances: Binance[] = []

  private async privateCall (settings: SettingsInterface): Promise<Binance> {
    if (!settings) throw new Error('Settings is required!')

    for (const instance of NodeBinanceApiAdapter.privateInstances) {
      const options = await instance.getOptions()

      if (settings.APIKEY === options.APIKEY && settings.APISECRET && options.APISECRET) {
        return instance
      }
    }

    const binance = new Binance().options(settings)

    NodeBinanceApiAdapter.privateInstances.push(binance)

    return binance
  }

  private async publicCall (): Promise<Binance> {
    const binance = await NodeBinanceApiAdapter.publicBinance.options({ reconnect: false })

    return binance
  }

  async orderTrade (data: InputOrderTradeInterface): Promise<OutputOrdertradeInterface> {
    const { symbol, orderId, settings } = data

    const binance = await this.privateCall(settings)

    const response: OutputOrdertradeInterface[] = await binance.trades(symbol)

    const order = response.find(order => order.orderId === orderId)

    if (!order) throw new Error('Order not found!')

    return order
  }

  async orderStatus (data: InputOrderStatusInterface): Promise<OutputOrderStatusInterface> {
    const { symbol, orderId, settings } = data

    const binance = await this.privateCall(settings)

    const response = await binance.orderStatus(symbol, undefined, undefined, { orderId: String(orderId) })

    return response
  }

  async chartStream (data: InputChartStreamInterface): Promise<void> {
    const { symbol, interval, callback, limit, settings } = data

    const binance = await this.privateCall(settings)

    await binance.websockets.chart(symbol, interval, async (symbol: any, interval: any, chart: any) => {
      await callback(await binance.ohlc(chart) as OutputOHLCInterface)
    }, limit)
  }

  async closeChartStream ({ symbol, interval, settings }: InputCloseChartStream): Promise<void> {
    const binance = await this.privateCall(settings)
    await binance.websockets.terminate(`${symbol.toLowerCase()}@kline_${interval}`)
  }
}
