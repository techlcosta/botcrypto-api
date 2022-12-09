import Binance from 'node-binance-api'
import { ExchangeRepositoryInterface, InputBuyInterface, InputCancelInterface, SettingsInterface, _callback } from '../interfaces/exchange-interface'

export class ExchangeRepository implements ExchangeRepositoryInterface {
  private readonly binance: Binance
  constructor () {
    this.binance = new Binance()
  }

  async setSettings (settings: SettingsInterface): Promise<void> {
    await this.binance.options(settings)
  }

  async exchangeBalance (callback?: _callback | undefined): Promise<any> {
    const balance = await this.binance.balance()

    return balance
  }

  async exchangeInfo (callback?: _callback): Promise<any> {
    const exchangeInfo = await this.binance.exchangeInfo()

    return exchangeInfo
  }

  async miniTickerStream (callback: _callback): Promise<void> {
    this.binance.websockets.miniTicker((market: any) => callback(market))
  }

  async bookTickersStream (callback: _callback): Promise<void> {
    this.binance.websockets.bookTickers((order: any) => callback(order))
  }

  async userDataStream (callback: _callback, executionCallback: boolean, listStatusCallback: _callback): Promise<void> {
    this.binance.websockets.userData(
      async (userData: any) => callback(userData),
      executionCallback,
      (subscribe: any) => console.log(`User data stream: subscrebed: ${subscribe as string}`),
      (listStatus: any) => listStatusCallback(listStatus)
    )
  }

  async buy (data: InputBuyInterface): Promise<any> {
    const { symbol, quantity, price, options, type } = data

    if (price && type !== 'MARKET') {
      const response = await this.binance.buy(symbol, quantity, price, options)

      return response
    } else {
      const response = await this.binance.marketBuy(symbol, quantity)

      return response
    }
  }

  async sell (data: InputBuyInterface): Promise<any> {
    const { symbol, quantity, price, options, type } = data

    if (price && type !== 'MARKET') {
      const response = await this.binance.sell(symbol, quantity, price, options)

      return response
    } else {
      const response = await this.binance.marketSell(symbol, quantity)

      return response
    }
  }

  async cancel ({ symbol, orderId }: InputCancelInterface): Promise<any> {
    const response = await this.binance.cancel(symbol, orderId)

    return response
  }
}
