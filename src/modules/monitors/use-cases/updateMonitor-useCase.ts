import { MonitorInterface, MonitorsRepositoryInterface } from '../interfaces/monitorsRepository-interface'
import { AppError } from './../../../helpers/errors/appError'
import { StartMonitor } from './../utils/startMonitor'
import { StopMonitor } from './../utils/stopMonitor'

interface RequestUpdateMonitorsInterface {
  id: string
  symbol: string
  type: string
  isActive: boolean
  broadcastLabel?: string
  interval?: string
  indexes?: string
  userId: string
}

export class UpdateMonitorUseCase {
  constructor (
    private readonly monitorsRepository: MonitorsRepositoryInterface,
    private readonly stopMonitor: StopMonitor,
    private readonly startMonitor: StartMonitor
  ) { }

  async execute ({ id, symbol, type, isActive, broadcastLabel, interval, indexes, userId }: RequestUpdateMonitorsInterface): Promise<MonitorInterface> {
    const alredyExists = await this.monitorsRepository.findById({ id, userId })

    if (!alredyExists) throw new AppError('This monitor not found!')

    if (alredyExists.isActive) await this.stopMonitor.execute(alredyExists.id, alredyExists.userId)

    const monitor = await this.monitorsRepository.update({
      id,
      symbol,
      type,
      isActive,
      broadcastLabel,
      interval,
      indexes
    })

    if (monitor.isActive) await this.startMonitor.execute(monitor.id, monitor.userId)

    return monitor
  }
}
