import Binance from 'node-binance-api'
import { InputCancelInterface, InputChartStreamInterface, InputNewOrderInterface, InputOrderStatusInterface, InputOrderTradeInterface, NodeBinanceApiAdapterInterface, OutputOHLCInterface, OutputOrderStatusInterface, OutputOrdertradeInterface, SettingsInterface, _callback } from '../interfaces/nodeBinanceApi-Interface'

export class NodeBinanceApiAdapter implements NodeBinanceApiAdapterInterface {
  instances: Binance[] = []

  private async setSettings (settings: SettingsInterface): Promise<Binance> {
    let binance: Binance | null = null

    for (const instance of this.instances) {
      const options = await instance.getOptions()

      if (options.APIKEY === settings.APIKEY && options.APISECRET === settings.APISECRET) {
        binance = instance
        break
      }
    }

    if (!binance) {
      binance = new Binance()
      await binance.options(settings)
      this.instances.push(binance)
    }

    return binance
  }

  async exchangeInfo (settings: SettingsInterface): Promise<any> {
    const binance = await this.setSettings(settings)

    const exchangeInfo = await binance.exchangeInfo()

    return exchangeInfo
  }

  async exchangeBalance (settings: SettingsInterface): Promise<any> {
    const binance = await this.setSettings(settings)

    const balance = await binance.balance()

    return balance
  }

  async buy (data: InputNewOrderInterface): Promise<any> {
    const { symbol, quantity, price, options, type, settings } = data

    const binance = await this.setSettings(settings)

    if (price && type !== 'MARKET') {
      const response = await binance.buy(symbol, quantity, price, options)

      return response
    } else {
      const response = await binance.marketBuy(symbol, quantity)

      return response
    }
  }

  async sell (data: InputNewOrderInterface): Promise<any> {
    const { symbol, quantity, price, options, type, settings } = data

    const binance = await this.setSettings(settings)

    if (price && type !== 'MARKET') {
      const response = await binance.sell(symbol, quantity, price, options)

      return response
    } else {
      const response = await binance.marketSell(symbol, quantity)

      return response
    }
  }

  async cancel (data: InputCancelInterface): Promise<any> {
    const { symbol, orderId, settings } = data

    const binance = await this.setSettings(settings)

    const response = await binance.cancel(symbol, orderId)

    return response
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

  async miniTickerStream (callback: _callback, settings: SettingsInterface): Promise<void> {
    const binance = await this.setSettings(settings)

    binance.websockets.miniTicker((market: any) => callback(market))
  }

  async chartStream (data: InputChartStreamInterface): Promise<void> {
    const { symbol, interval, callback, limit, settings } = data

    const binance = await this.setSettings(settings)

    await binance.websockets.chart(symbol, interval, async (symbol: any, interval: any, chart: any) => {
      await callback(await binance.ohlc(chart) as OutputOHLCInterface)
    }, limit)
  }

  async userDataStream (callback: _callback, executionCallback: boolean, listStatusCallback: _callback, settings: SettingsInterface): Promise<void> {
    const binance = await this.setSettings(settings)

    binance.websockets.userData(
      async (userData: any) => callback(userData),
      executionCallback,
      (subscribe: any) => console.log(`User data stream: subscrebed: ${subscribe as string}`),
      (listStatus: any) => listStatusCallback(listStatus)
    )
  }
}
