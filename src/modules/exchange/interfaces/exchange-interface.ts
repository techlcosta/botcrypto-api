import { SettingsInterface } from '../../../helpers/adapters/nodeBinanceApi/nodeBinanceApi-Interface'

export interface InputStartMiniTickerMonitorInterface {
  showLogs: boolean
  broadcastLabel: string
  broadcast: (data: Object) => void
}

export interface InputStartTickerMonitorInterface {
  showLogs: boolean
  broadcastLabel: string
  broadcast: (data: Object) => void
}
export interface InputStartUserDataMonitorInterface {
  settings: SettingsInterface
  broadcastLabel: string
  showLogs: boolean
  userId: string
  direct: (userId: string, data: Object) => void
}

export interface InputStartChartMonitorInterface {
  userId: string
  settings: SettingsInterface
  symbol: string
  interval: string
  broadcastLabel?: string
  showLogs: boolean
  indexes: string
  limit?: number
  direct: (userId: string, data: Object) => void
}

export interface ExchangeActionsInterface {
  startTickerAndBookMonitor: (data: InputStartTickerMonitorInterface) => Promise<void>
  startMiniTickerMonitor: (data: InputStartMiniTickerMonitorInterface) => Promise<void>
  startUserDataMonitor: (data: InputStartUserDataMonitorInterface) => Promise<void>
  startChartMonitor: (data: InputStartChartMonitorInterface) => Promise<void>
}
