import { AppError } from '../../../helpers/errors/appError'
import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'
import { MonitorsActionsInterface } from '../interfaces/monitorsActions-interface'
import { MonitorsRepositoryInterface } from '../interfaces/monitorsRepository-interface'

export class StopMonitorUseCase {
  constructor (
    private readonly monitorsActions: MonitorsActionsInterface,
    private readonly monitorsRepository: MonitorsRepositoryInterface,
    private readonly getSettingsDecrypted: GetSettingsDecryptedInterface
  ) {}

  async execute (id: string, userId: string): Promise<void> {
    try {
      const settings = await this.getSettingsDecrypted.handle({ userId })

      const monitor = await this.monitorsRepository.findById({ id, userId })

      if (!monitor) throw new AppError('This monitor not found!')

      await this.monitorsRepository.update({ id: monitor.id, isActive: false })

      await this.monitorsActions.stopChartMonitor({ settings, userId, symbol: monitor.symbol, interval: monitor.interval ?? '', indexes: monitor.indexes ?? '' })
    } catch (error: any) {
      throw new AppError(error.message || error.body)
    }
  }
}
