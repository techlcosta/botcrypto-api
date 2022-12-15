import { AesCrypto } from '../../../helpers/adapters/aesCrypto/aesCrypto-adapter'
import { NodeBinanceApiAdapter } from '../../../helpers/adapters/nodeBinanceApi/functions/nodeBinanceApi-adapter'
import { GetSettingsDecrypted } from '../../../helpers/utils/getSettingsDecrypted'
import { OrdersRepository } from '../../orders/repositories/orders-repository'
import { UsersRepository } from '../../users/repositories/users-repository'
import { ExchangeActions } from '../actions/exchange-actions'
import { ExchangeMonitorUseCase } from '../use-cases/exchangeMonitor-useCase'
import { WebSocketServer } from './../../../app-ws'
import { MonitorsRepository } from './../../monitors/repositories/monitors-repository'

interface ExchangeMonitorControllerRequestInterface {
  server: any
}

export class ExchangeMonitorController {
  async handle ({ server }: ExchangeMonitorControllerRequestInterface): Promise<void> {
    const aesCrypto = new AesCrypto()

    const usersRepository = new UsersRepository()

    const ordersRepository = new OrdersRepository()

    const monitorsRepository = new MonitorsRepository()

    const nodeBinanceApiAdapter = new NodeBinanceApiAdapter()

    const webSocketServer = new WebSocketServer(usersRepository)

    const getSettingsDecrypted = new GetSettingsDecrypted(usersRepository, aesCrypto)

    const exchangeActions = new ExchangeActions(nodeBinanceApiAdapter, ordersRepository)

    const exchangeMonitorUseCase = new ExchangeMonitorUseCase(webSocketServer, monitorsRepository, getSettingsDecrypted, exchangeActions)

    await webSocketServer.execute(server)

    await exchangeMonitorUseCase.execute()
  }
}
