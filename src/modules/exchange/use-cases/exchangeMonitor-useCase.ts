
import { WebSocketServerInterface } from '../../../app-ws'
import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'
import { MonitorsRepositoryInterface, MonitorTypes } from '../../monitors/interfaces/monitors-interface'
import { ExchangeActionsInterface } from '../interfaces/exchange-interface'

export class ExchangeMonitorUseCase {
  constructor (
    private readonly wss: WebSocketServerInterface,
    private readonly monitorsRepository: MonitorsRepositoryInterface,
    private readonly getSettingsDecrypted: GetSettingsDecryptedInterface,
    private readonly exchangeActions: ExchangeActionsInterface
  ) { }

  async execute (): Promise<void> {
    const monitors = await this.monitorsRepository.getActiveMonitors()

    if (!monitors) return

    for (const monitor of monitors) {
      const settings = await this.getSettingsDecrypted.handle({ userId: monitor.userId })
      setTimeout(() => {
        switch (monitor.type) {
          case MonitorTypes.MINI_TICKER:
            return this.exchangeActions.startMiniTickerMonitor({
              broadcastLabel: monitor.broadcastLabel ?? undefined,
              showLogs: monitor.showLogs,
              broadcast: (data) => this.wss.broadcast(data),
              settings
            })

          case MonitorTypes.USER_DATA:
            return this.exchangeActions.startUserDataMonitor({
              broadcastLabel: monitor.broadcastLabel ?? '',
              showLogs: monitor.showLogs,
              userId: monitor.userId,
              direct: (userId, data) => this.wss.direct(userId, data),
              settings
            })

          case MonitorTypes.CANDLES:
            return this.exchangeActions.startChartMonitor({
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
