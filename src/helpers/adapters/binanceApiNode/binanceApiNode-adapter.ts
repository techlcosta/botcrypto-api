import BinanceApi, { Account, Binance, CancelOrderResult, ExchangeInfo, MiniTicker, MyTrade, NewOrderSpot, OrderType_LT, QueryOrderResult, Ticker } from 'binance-api-node'
import { BinanceApiNodeAdapterInterface, InputCancelInterface, InputChartStreamInterface, InputOrderStatusInterface, InputOrderTradeInterface, InputUserDataStreamInterface, OutputNewOrder, SettingsInterface } from './binanceApiNode-interface'

export class BinanceApiNodeAdapter implements BinanceApiNodeAdapterInterface {
  private async newClient (settings?: SettingsInterface): Promise<Binance> {
    if (settings) {
      return BinanceApi({
        apiKey: settings?.APIKEY,
        apiSecret: settings?.APISECRET,
        httpBase: 'https://testnet.binance.vision',
        wsBase: 'wss://testnet.binance.vision/ws'
      })
    }

    return BinanceApi()
  }

  async exchangeInfo (settings: SettingsInterface): Promise<ExchangeInfo<OrderType_LT>> {
    const binance = await this.newClient(settings)
    return await binance.exchangeInfo()
  }

  async newOrder (settings: SettingsInterface, options: NewOrderSpot): Promise<OutputNewOrder> {
    const binance = await this.newClient(settings)
    return await binance.order(options)
  }

  async exchangeBalance (settings: SettingsInterface): Promise<Account> {
    const binance = await this.newClient(settings)
    return await binance.accountInfo()
  }

  async cancel ({ settings, symbol, orderId }: InputCancelInterface): Promise<CancelOrderResult> {
    const binance = await this.newClient(settings)
    return await binance.cancelOrder({ symbol, orderId })
  }

  async orderTrade ({ settings, symbol, orderId }: InputOrderTradeInterface): Promise<MyTrade[]> {
    const binance = await this.newClient(settings)
    return await binance.myTrades({ symbol, orderId })
  }

  async orderStatus ({ settings, symbol, orderId }: InputOrderStatusInterface): Promise<QueryOrderResult> {
    const binance = await this.newClient(settings)
    return await binance.getOrder({ symbol, orderId })
  }

  async miniTickerStream (callback: (miniTicker: MiniTicker[]) => void): Promise<void> {
    const binance = await this.newClient()
    binance.ws.allMiniTickers(miniTicker => callback(miniTicker))
  }

  async tickerStream (callback: (tickers: Ticker[]) => void): Promise<void> {
    const binance = await this.newClient()
    binance.ws.allTickers(tickers => callback(tickers))
  }

  async chartStream ({ symbol, interval, callback, settings }: InputChartStreamInterface): Promise<void> {
    const binance = await this.newClient(settings)
    binance.ws.candles(symbol, interval, candle => callback(candle))
  }

  async userDataStream ({ settings, callback }: InputUserDataStreamInterface): Promise<void> {
    const binance = await this.newClient(settings)
    await binance.ws.user(async (msg) => await callback(msg))
  }
}
