export enum MonitorTypesEnum {
  MINI_TICKER = 'MINI_TICKER',
  TICKER = 'TICKER',
  BOOK = 'BOOK',
  USER_DATA = 'USER_DATA',
  CANDLES = 'CANDLES',
  WALLET = 'WALLET',
  LAST_ORDER = 'LAST_ORDER',
  LAST_CANDLE = 'LAST_CANDLE',
  RSI = 'RSI',
  MACD = 'MACD'
}

export const IndexesTypesEnum = MonitorTypesEnum

export type MonitorTypesType = 'MINI_TICKER'
| 'TICKER'
| 'BOOK'
| 'USER_DATA'
| 'CANDLES'
| 'WALLET'
| 'LAST_ORDER'
| 'LAST_CANDLE'
| 'RSI'
| 'MACD'

export type IndexesTypesType = MonitorTypesType
