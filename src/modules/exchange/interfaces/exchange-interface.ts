import { SettingsInterface } from '../../../helpers/adapters/nodeBinanceApi/interfaces/nodeBinanceApi-Interface'

export interface InputStartMiniTickerMonitorInterface {
  settings: SettingsInterface
  showLogs: boolean
  broadcastLabel?: string
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
  startMiniTickerMonitor: (data: InputStartMiniTickerMonitorInterface) => Promise<void>
  startUserDataMonitor: (data: InputStartUserDataMonitorInterface) => Promise<void>
  startChartMonitor: (data: InputStartChartMonitorInterface) => Promise<void>
}
