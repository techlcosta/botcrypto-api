export type SideOrderType = 'BUY' | 'SELL'

export type TypeOrderType = 'ICEBERG' | 'LIMIT' | 'MARKET' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT'

export type StopTypes = 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT'

type OrderStatusType = 'NEW' | 'FILLED' | 'CANCELED' | 'REJECTED'

export interface ExecutionReportInterface {
  e: string // Event type
  E: bigint // Event time
  s: string // Symbol
  c: string // Client order ID
  S: string // Side
  o: TypeOrderType // Order type
  f: string // Time in force
  q: string // Order quantity
  p: string // Order price
  P: string // Stop price
  d: number // Trailing Delta; This is only visible if the order was a trailing stop order.
  F: string // Iceberg quantity
  g: number // OrderListId
  C: string // Original client order ID; This is the ID of the order being canceled
  x: string // Current execution type
  X: OrderStatusType // Current order status
  r: string // Order reject reason; will be an error code.
  i: number // Order ID
  l: string // Last executed quantity
  z: string // Cumulative filled quantity
  L: string // Last executed price
  n: string // Commission amount
  N: null // Commission asset
  T: bigint // Transaction time
  t: number // Trade ID
  I: number // Ignore
  w: boolean // Is the order on the book?
  m: boolean // Is this trade the maker side?
  M: boolean // Ignore
  O: bigint // Order creation time
  Z: string // Cumulative quote asset transacted quantity
  Y: string // Last quote asset transacted quantity (i.e. lastPrice * lastQty)
  Q: string // Quote Order Qty
  j: number// Strategy ID; This is only visible if the strategyId parameter was provided upon order placement
  J: number // Strategy Type; This is only visible if the strategyType parameter was provided upon order placement
}

export type _callback = (...args: any) => any
export type _asyncCallback = (...args: any) => Promise<any>

export interface SettingsInterface {
  APIKEY: string
  APISECRET: string
  urls: {
    base: string
    stream: string
  }
}

export interface InputBuyInterface {
  symbol: string
  quantity: number
  type: TypeOrderType
  price?: number
  options: {
    type: string
    stopPrice?: number
    icebergQuantity?: number
  }
}

export interface InputCancelInterface {
  symbol: string
  orderId: number
}

export interface ExchangeRepositoryInterface {
  setSettings: (settings: SettingsInterface) => Promise<void>
  exchangeBalance: (callback?: _callback) => Promise<any>
  exchangeInfo: (callback?: _callback) => Promise<any>
  miniTickerStream: (callback: _callback) => Promise<void>
  bookTickersStream: (callback: _callback) => Promise<void>
  userDataStream: (callback: _callback, executionCallback: boolean, listStatusCallback: _callback) => Promise<void>
  buy: (data: InputBuyInterface) => Promise<any>
  sell: (data: InputBuyInterface) => Promise<any>
  cancel: ({ symbol, orderId }: InputCancelInterface) => Promise<any>
}
