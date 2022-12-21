import Binance from 'node-binance-api'
import { InputChartStreamInterface, InputOrderStatusInterface, InputOrderTradeInterface, NodeBinanceApiAdapterInterface, OutputOHLCInterface, OutputOrderStatusInterface, OutputOrdertradeInterface, SettingsInterface } from './nodeBinanceApi-Interface'

export class NodeBinanceApiAdapter implements NodeBinanceApiAdapterInterface {
  instances: Binance[] = []

  private async setSettings (settings?: SettingsInterface): Promise<Binance> {
    let binance: Binance | null = null

    for (const instance of this.instances) {
      const options = await instance.getOptions()

      if (settings && options.APIKEY === settings.APIKEY && options.APISECRET === settings.APISECRET) {
        binance = instance
        break
      }
    }

    if (!binance) {
      binance = new Binance()
      if (settings?.urls.base.includes('testnet.binance')) settings.urls = { base: 'https://testnet.binance.vision/api/', stream: settings.urls.stream }
      if (settings?.urls.stream.includes('testnet.binance')) settings.urls = { base: settings.urls.base, stream: 'wss://testnet.binance.vision/ws/' }
      await binance.options(settings)
      this.instances.push(binance)
    }

    return binance
  }

  async orderTrade (data: InputOrderTradeInterface): Promise<OutputOrdertradeInterface> {
    const { symbol, orderId, settings } = data

    const binance = await this.setSettings(settings)

    const response: OutputOrdertradeInterface[] = await binance.trades(symbol)

    const order = response.find(order => order.orderId === orderId)

    if (!order) throw new Error('Order not found!')

    return order
  }

  async orderStatus (data: InputOrderStatusInterface): Promise<OutputOrderStatusInterface> {
    const { symbol, orderId, settings } = data

    const binance = await this.setSettings(settings)

    const response = await binance.orderStatus(symbol, undefined, undefined, { orderId: String(orderId) })

    return response
  }

  async chartStream (data: InputChartStreamInterface): Promise<void> {
    const { symbol, interval, callback, limit, settings } = data

    const binance = await this.setSettings(settings)

    await binance.websockets.chart(symbol, interval, async (symbol: any, interval: any, chart: any) => {
      await callback(await binance.ohlc(chart) as OutputOHLCInterface)
    }, limit)
  }
}
