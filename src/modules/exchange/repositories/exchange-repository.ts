import Binance from 'node-binance-api'
import { ExchangeRepositoryInterface, SettingsInterface, _callback } from '../interfaces/exchange-interface'

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

  async userDataStream (balanceCallback: _callback, executionCallback: _callback, listStatusCallback: _callback): Promise<void> {
    this.binance.websockets.userData(
      (balance: any) => balanceCallback(balance),
      (execution: any) => executionCallback(execution),
      (subscribe: any) => console.log(`User data stream: subscrebed: ${subscribe as string}`),
      (listStatus: any) => listStatusCallback(listStatus)
    )
  }
}
