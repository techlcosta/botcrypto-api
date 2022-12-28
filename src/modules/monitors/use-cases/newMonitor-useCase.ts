import { MonitorsRepositoryInterface } from '../interfaces/monitorsRepository-interface'
import { StartMonitor } from './../utils/startMonitor'

interface RequestNewMonitorsInterface {
  symbol: string
  type: string
  isActive: boolean
  broadcastLabel?: string
  interval?: string
  indexes?: string
  userId: string
}

export class NewMonitorUseCase {
  constructor (
    private readonly monitorsRepository: MonitorsRepositoryInterface,
    private readonly startMonitor: StartMonitor
  ) { }

  async execute ({ symbol, type, isActive, broadcastLabel, interval, indexes, userId }: RequestNewMonitorsInterface): Promise<void> {
    const monitor = await this.monitorsRepository.create({
      symbol,
      type,
      isActive,
      broadcastLabel,
      interval,
      indexes,
      userId
    })

    if (monitor.isActive) await this.startMonitor.execute(monitor.id, monitor.userId)
  }
}
