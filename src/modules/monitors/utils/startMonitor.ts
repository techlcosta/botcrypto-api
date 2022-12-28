import { WebSocketServer } from '../../../app-ws'
import { AesCrypto } from '../../../helpers/adapters/aesCrypto/aesCrypto-adapter'
import { BinanceApiNodeAdapter } from '../../../helpers/adapters/binanceApiNode/binanceApiNode-adapter'
import { NodeBinanceApiAdapter } from '../../../helpers/adapters/nodeBinanceApi/nodeBinanceApi-adapter'
import { TechnicalIndicatorsAdapter } from '../../../helpers/adapters/technicalIndicators/technicalIndicators-adapter'
import { GetSettingsDecrypted } from '../../../helpers/utils/getSettingsDecrypted'
import { OrdersRepository } from '../../orders/repositories/orders-repository'
import { RobotRepository } from '../../robot/repositories/robot-repository'
import { UsersRepository } from '../../users/repositories/users-repository'
import { MonitorsActions } from '../actions/monitors-actions'
import { MonitorsRepository } from '../repositories/monitors-repository'
import { StartMonitorUseCase } from '../use-cases/startMonitor-useCase'

export class StartMonitor {
  async execute (id: string, userId: string): Promise<void> {
    const aesCrypto = new AesCrypto()

    const usersRepository = new UsersRepository()

    const ordersRepository = new OrdersRepository()

    const monitorsRepository = new MonitorsRepository()

    const binanceApiNodeAdapter = new BinanceApiNodeAdapter()

    const robotRepository = new RobotRepository()

    const nodeBinanceApiAdapter = new NodeBinanceApiAdapter()

    const technicalIndicatorsAdapter = new TechnicalIndicatorsAdapter()

    const webSocketServer = new WebSocketServer(usersRepository)

    const monitorsActions = new MonitorsActions(nodeBinanceApiAdapter, binanceApiNodeAdapter, ordersRepository, robotRepository, technicalIndicatorsAdapter)

    const getSettingsDecrypted = new GetSettingsDecrypted(usersRepository, aesCrypto)

    const startMonitorUseCase = new StartMonitorUseCase(webSocketServer, monitorsActions, monitorsRepository, getSettingsDecrypted)

    await startMonitorUseCase.execute(id, userId)
  }
}
