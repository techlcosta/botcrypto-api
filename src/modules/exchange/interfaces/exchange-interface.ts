
export type _callback = (...args: any) => any

export interface SettingsInterface {
  APIKEY: string
  APISECRET: string
  urls: {
    base: string
    stream: string
  }
}

export interface ExchangeRepositoryInterface {
  setSettings: (settings: SettingsInterface) => Promise<void>
  exchangeBalance: (callback?: _callback) => Promise<any>
  exchangeInfo: (callback?: _callback) => Promise<any>
  miniTickerStream: (callback: _callback) => Promise<void>
  bookTickersStream: (callback: _callback) => Promise<void>
  userDataStream: (balanceCallback: _callback, executionCallback: _callback, listStatusCallback: _callback) => Promise<void>
}
