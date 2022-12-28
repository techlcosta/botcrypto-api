import { WebSocketServerInterface } from '../../../app-ws'
import { AppError } from '../../../helpers/errors/appError'
import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'
import { MonitorsActionsInterface } from '../interfaces/monitorsActions-interface'
import { MonitorsRepositoryInterface } from '../interfaces/monitorsRepository-interface'

export class StartMonitorUseCase {
  constructor (
    private readonly wss: WebSocketServerInterface,
    private readonly monitorsActions: MonitorsActionsInterface,
    private readonly monitorsRepository: MonitorsRepositoryInterface,
    private readonly getSettingsDecrypted: GetSettingsDecryptedInterface
  ) { }

  async execute (id: string, userId: string): Promise<void> {
    const settings = await this.getSettingsDecrypted.handle({ userId })

    const monitor = await this.monitorsRepository.findById({ id, userId })

    if (!monitor) throw new AppError('This monitor not found!')

    await this.monitorsRepository.update({ id: monitor.id, isActive: true })

    await this.monitorsActions.startChartMonitor({
      userId: monitor.userId,
      symbol: monitor.symbol,
      interval: monitor.interval ?? 'm1',
      showLogs: monitor.showLogs,
      broadcastLabel: monitor.broadcastLabel ?? '',
      indexes: monitor.indexes ?? '',
      direct: (userId, data) => this.wss.direct(userId, data),
      settings
    })
  }
}
