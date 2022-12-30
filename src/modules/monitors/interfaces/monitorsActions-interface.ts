import { SettingsInterface } from '../../../dtos/dtos'

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

export interface StopChartMonitorInterface {
  userId: string
  settings: SettingsInterface
  symbol: string
  interval: string
  indexes: string
}

export interface MonitorsActionsInterface {
  startTickerAndBookMonitor: (data: InputStartTickerMonitorInterface) => Promise<void>
  startMiniTickerMonitor: (data: InputStartMiniTickerMonitorInterface) => Promise<void>
  startUserDataMonitor: (data: InputStartUserDataMonitorInterface) => Promise<void>
  startChartMonitor: (data: InputStartChartMonitorInterface) => Promise<void>
  stopChartMonitor: (data: StopChartMonitorInterface) => Promise<void>
  clearCache: () => Promise<void>
}
