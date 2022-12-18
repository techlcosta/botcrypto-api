import { Account, CancelOrderResult, Candle, ExchangeInfo, MiniTicker, MyTrade, NewOrderSpot, Order, OrderType_LT, QueryOrderResult, Ticker, UserDataStreamEvent } from 'binance-api-node'

export type SideOrderTypes = 'BUY' | 'SELL'

export type TypeOrderTypes = 'ICEBERG' | 'LIMIT' | 'MARKET' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT'

export type StopOrderTypes = 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT'

export type StatusOrderTypes = 'NEW' | 'FILLED' | 'CANCELED' | 'REJECTED'

export const enum OrderType {
  LIMIT = 'LIMIT',
  LIMIT_MAKER = 'LIMIT_MAKER',
  MARKET = 'MARKET',
  STOP = 'STOP',
  STOP_MARKET = 'STOP_MARKET',
  STOP_LOSS_LIMIT = 'STOP_LOSS_LIMIT',
  TAKE_PROFIT_LIMIT = 'TAKE_PROFIT_LIMIT',
  TAKE_PROFIT_MARKET = 'TAKE_PROFIT_MARKET',
  TRAILING_STOP_MARKET = 'TRAILING_STOP_MARKET',
}

export interface SettingsInterface {
  APIKEY: string
  APISECRET: string
  urls: {
    base: string
    stream: string
  }
}

export type OutputNewOrder = Order

export interface InputCancelInterface {
  settings: SettingsInterface
  symbol: string
  orderId: number
}

export interface InputOrderStatusInterface {
  settings: SettingsInterface
  symbol: string
  orderId: number
}

export interface InputOrderTradeInterface {
  settings: SettingsInterface
  symbol: string
  orderId: number
}

export interface InputChartStreamInterface {
  symbol: string | string[]
  interval: string
  callback: (ticker: Candle) => void
  settings: SettingsInterface
}

export interface InputUserDataStreamInterface {
  callback: (msg: UserDataStreamEvent) => Promise<void>
  settings: SettingsInterface
}

export interface BinanceApiNodeAdapterInterface {
  exchangeInfo: (settings: SettingsInterface) => Promise<ExchangeInfo<OrderType_LT>>
  exchangeBalance: (settings: SettingsInterface) => Promise<Account>
  newOrder: (settings: SettingsInterface, options: NewOrderSpot) => Promise<OutputNewOrder>
  cancel: (data: InputCancelInterface) => Promise<CancelOrderResult>
  orderTrade: (data: InputOrderTradeInterface) => Promise<MyTrade[]>
  orderStatus: (data: InputOrderStatusInterface) => Promise<QueryOrderResult>
  miniTickerStream: (callback: (tickers: MiniTicker[]) => Promise<void>) => Promise<void>
  tickerStream: (callback: (tickers: Ticker[]) => Promise<void>) => Promise<void>
  chartStream: (data: InputChartStreamInterface) => Promise<void>
  userDataStream: (data: InputUserDataStreamInterface) => Promise<void>
}
