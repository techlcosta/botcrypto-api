export enum MonitorTypesEnum {
  MINI_TICKER = 'MINI_TICKER',
  TICKER = 'TICKER',
  BOOK = 'BOOK',
  CANDLES = 'CANDLES',
  WALLET = 'WALLET',
  LAST_ORDER = 'LAST_ORDER',
  LAST_CANDLE = 'LAST_CANDLE',
  RSI = 'RSI',
  MACD = 'MACD',
  STOCH_RSI = 'SRSI',
  SMA = 'SMA',
  EMA = 'EMA',
  BOLLINGER_BANDS = 'BB'
}

export const IndexesTypesEnum = MonitorTypesEnum

export type MonitorTypesType =
| 'MINI_TICKER'
| 'TICKER'
| 'BOOK'
| 'CANDLES'
| 'WALLET'

export type IndexesTypesType =
| 'MINI_TICKER'
| 'TICKER'
| 'BOOK'
| 'WALLET'
| 'LAST_ORDER'
| 'LAST_CANDLE'
| 'RSI'
| 'MACD'
| 'SRSI'
| 'SMA'
| 'EMA'
| 'BB'

export interface SettingsInterface {
  APIKEY: string
  APISECRET: string
  urls: {
    base: string
    stream: string
  }
}
