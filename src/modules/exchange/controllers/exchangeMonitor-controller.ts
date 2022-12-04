import WebSocket from 'ws'
import { AesCrypto } from '../../../helpers/adapters/aesCrypto'
import { GetSettingsDecrypted } from '../../../helpers/utils/getSettingsDecrypted'
import { OrdersRepository } from '../../orders/repositories/orders-repository'
import { UsersRepository } from '../../users/repositories/users-repository'
import { ExchangeRepository } from '../repositories/exchange-repository'
import { ExchangeMonitorUseCase } from '../use-cases/exchangeMonitor-useCase'

interface ExchangeMonitorControllerRequestInterface {
  userProtocol: string
  wssServer: WebSocket.Server<WebSocket.WebSocket>
}

export class ExchangeMonitorController {
  async handle ({ userProtocol, wssServer }: ExchangeMonitorControllerRequestInterface): Promise<void> {
    const usersRepository = new UsersRepository()

    const aesCrypto = new AesCrypto()

    const getSettingsDecrypted = new GetSettingsDecrypted(usersRepository, aesCrypto)

    const exchangeRepository = new ExchangeRepository()

    const ordersRepository = new OrdersRepository()

    const exchangeMonitorUseCase = new ExchangeMonitorUseCase(userProtocol, wssServer, getSettingsDecrypted, exchangeRepository, ordersRepository)

    await exchangeMonitorUseCase.execute()
  }
}
