import { SettingsInterface } from '../../../dtos/dtos'

export type SideOrderTypes = 'BUY' | 'SELL'

export type TypeOrderTypes = 'ICEBERG' | 'LIMIT' | 'MARKET' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT'

export type StopOrderTypes = 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT'

export type StatusOrderTypes = 'NEW' | 'FILLED' | 'CANCELED' | 'REJECTED'

export type _callback = (...args: any) => any

export type _asyncCallback = (...args: any) => Promise<any>

export interface OutputBalanceInterface {
  [key: string]: {
    available: string
    onOrder: string
  }
}

export interface InputNewOrderInterface {
  settings: SettingsInterface
  symbol: string
  quantity: number
  type: TypeOrderTypes
  price?: number
  options: {
    type: TypeOrderTypes
    stopPrice?: number
    icebergQuantity?: number
  }
}

export interface OutputNewOrderInterface {
  symbol: string
  orderId: number
  orderListId: number // Unless OCO, value will be -1
  clientOrderId: string
  transactTime: bigint
  price: string
  origQty: string
  executedQty: string
  cummulativeQuoteQty: string
  status: StatusOrderTypes
  timeInForce: string
  type: TypeOrderTypes
  side: SideOrderTypes
  strategyId?: number // This is only visible if the field was populated on order placement.
  strategyType?: number // This is only visible if the field was populated on order placement.
  workingTime: bigint
  selfTradePreventionMode: string
}

export interface InputCancelInterface {
  settings: SettingsInterface
  symbol: string
  orderId: number
}

export interface OutputCancelOrderInterface {
  symbol: string
  origClientOrderId: string
  orderId: number
  orderListId: number // Unless part of an OCO, the value will always be -1.
  clientOrderId: string
  price: string
  origQty: string
  executedQty: string
  cummulativeQuoteQty: string
  status: StatusOrderTypes
  timeInForce: string
  type: TypeOrderTypes
  side: SideOrderTypes
  selfTradePreventionMode: string
}

export interface InputOrderStatusInterface {
  settings: SettingsInterface
  symbol: string
  orderId: number
}

export interface OutputOrderStatusInterface {
  symbol: string
  orderId: number
  orderListId: number // Unless part of an OCO, the value will always be -1
  clientOrderId: string
  price: string
  origQty: string
  executedQty: string
  cummulativeQuoteQty: string
  status: StatusOrderTypes
  timeInForce: string
  type: TypeOrderTypes
  side: SideOrderTypes
  stopPrice: string
  icebergQty: string
  time: bigint
  updateTime: bigint
  isWorking: true
  workingTime: bigint
  origQuoteOrderQty: string
  selfTradePreventionMode: string
}

export interface InputOrderTradeInterface {
  settings: SettingsInterface
  symbol: string
  orderId: number
}

export interface OutputOrdertradeInterface {
  symbol: string
  id: number
  orderId: number
  orderListId: number
  price: string
  qty: string
  quoteQty: string
  commission: string
  commissionAsset: string
  time: bigint
  isBuyer: boolean
  isMaker: false
  isBestMatch: boolean
}

export interface OutputExecutionReportInterface {
  e: string // Event type
  E: bigint // Event time
  s: string // Symbol
  c: string // Client order ID
  S: string // Side
  o: TypeOrderTypes // Order type
  f: string // Time in force
  q: string // Order quantity
  p: string // Order price
  P: string // Stop price
  d: number // Trailing Delta; This is only visible if the order was a trailing stop order.
  F: string // Iceberg quantity
  g: number // OrderListId
  C: string // Original client order ID; This is the ID of the order being canceled
  x: string // Current execution type
  X: StatusOrderTypes // Current order status
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

export interface OutputMiniTickerStream {
  [key: string]: {
    close: string
    eventTime: string
    high: string
    low: string
    open: string
    quoteVolume: string
    volume: string
  }
}

export interface InputChartStreamInterface {
  settings: SettingsInterface
  symbol: string
  interval: string
  callback: _callback
  limit?: number
}

export interface OutputOHLCInterface {
  open: number[]
  high: number[]
  low: number[]
  close: number[]
  volume: number[]
}

export interface InputCloseChartStream {
  settings: SettingsInterface
  symbol: string
  interval: string
}

export interface NodeBinanceApiAdapterInterface {
  orderTrade: (data: InputOrderTradeInterface) => Promise<OutputOrdertradeInterface>
  orderStatus: (data: InputOrderStatusInterface) => Promise<OutputOrderStatusInterface>
  chartStream: (data: InputChartStreamInterface) => Promise<void>
  closeChartStream: (data: InputCloseChartStream) => Promise<void>
}
