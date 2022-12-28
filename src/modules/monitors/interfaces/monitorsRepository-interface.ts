
export interface MonitorInterface {
  id: string
  symbol: string
  type: string
  isActive: boolean
  isSystemMonitor: boolean
  showLogs: boolean
  broadcastLabel?: string | null
  interval?: string | null
  indexes?: string | null
  userId: string
  updatedAt: Date
  createdAt: Date
}

export interface InputCreateMonitorInterface {
  symbol: string
  type: string
  isActive: boolean
  broadcastLabel?: string
  interval?: string
  indexes?: string
  userId: string
}

export interface InputUpdateMonitorInterface {
  id: string
  symbol?: string
  type?: string
  interval?: string
  isActive?: boolean
  isSystemMonitor?: boolean
  showLogs?: boolean
  broadcastLabel?: string
  indexes?: string
}
export interface InputDeleteMonitorInterface {
  id: string
  userId: string
}

export interface InputFindMonitorByIdInterface {
  id: string
  userId: string
}

export interface InputFindMonitorByUserIdInterface {
  userId: string
}

export interface InputGetActiveMonitorsInterface {
  isActive: boolean
}

export interface InputCountMonitorsInterface {
  userId: string
  symbol?: string
}

export interface InputGetMonitorsInterface {
  userId: string
  symbol?: string
  page: number
}

export interface MonitorAlredyExistsInterface {
  userId: string
  type: string
  symbol: string
  interval?: string
}

export interface MonitorsRepositoryInterface {
  create: (data: InputCreateMonitorInterface) => Promise<MonitorInterface>
  update: (data: InputUpdateMonitorInterface) => Promise<MonitorInterface>
  delete: (data: InputDeleteMonitorInterface) => Promise<void>
  findById: (data: InputFindMonitorByIdInterface) => Promise<MonitorInterface | null>
  findByUserId: (data: InputFindMonitorByUserIdInterface) => Promise<MonitorInterface[]>
  getActiveMonitors: () => Promise<MonitorInterface[] | null>
  count: (data: InputCountMonitorsInterface) => Promise<number>
  get: (data: InputGetMonitorsInterface) => Promise<MonitorInterface[]>
  monitorAlredyExists: (data: MonitorAlredyExistsInterface) => Promise<MonitorInterface | null>
}
