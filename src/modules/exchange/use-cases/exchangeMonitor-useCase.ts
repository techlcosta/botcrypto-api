
import { WebSocketServerInterface } from '../../../app-ws'
import { MonitorTypesEnum } from '../../../dtos/dtos'
import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'
import { MonitorsActionsInterface } from '../../monitors/interfaces/monitorsActions-interface'
import { MonitorsRepositoryInterface } from '../../monitors/interfaces/monitorsRepository-interface'

export class ExchangeMonitorUseCase {
  constructor (
    private readonly wss: WebSocketServerInterface,
    private readonly monitorsRepository: MonitorsRepositoryInterface,
    private readonly getSettingsDecrypted: GetSettingsDecryptedInterface,
    private readonly monitorsActions: MonitorsActionsInterface
  ) { }

  async execute (): Promise<void> {
    await this.monitorsActions.clearCache()

    const monitors = await this.monitorsRepository.getActiveMonitors()

    await this.monitorsActions.startMiniTickerMonitor({
      broadcastLabel: 'miniTickerStream',
      showLogs: false,
      broadcast: (data) => this.wss.broadcast(data)
    })

    await this.monitorsActions.startTickerAndBookMonitor({
      broadcastLabel: 'TickerStream,bookStream',
      showLogs: false,
      broadcast: (data) => this.wss.broadcast(data)
    })

    if (!monitors) return

    for (const monitor of monitors) {
      const settings = await this.getSettingsDecrypted.handle({ userId: monitor.userId })
      setTimeout(() => {
        switch (monitor.type) {
          case MonitorTypesEnum.WALLET:
            return this.monitorsActions.startUserDataMonitor({
              broadcastLabel: monitor.broadcastLabel ?? '',
              showLogs: monitor.showLogs,
              userId: monitor.userId,
              direct: (userId, data) => this.wss.direct(userId, data),
              settings
            })

          case MonitorTypesEnum.CANDLES:
            return this.monitorsActions.startChartMonitor({
              userId: monitor.userId,
              symbol: monitor.symbol,
              interval: monitor.interval ?? 'm1',
              showLogs: monitor.showLogs,
              broadcastLabel: monitor.broadcastLabel ?? '',
              indexes: monitor.indexes ?? '',
              direct: (userId, data) => this.wss.direct(userId, data),
              settings
            })
          default:
        }
      }, 250)
    }
  }
}
