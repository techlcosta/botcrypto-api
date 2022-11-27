import WebSocket from 'ws'
import { AesCrypto } from '../../../helpers/adapters/aesCrypto'
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

    const exchangeRepository = new ExchangeRepository()

    const exchangeMonitorUseCase = new ExchangeMonitorUseCase(userProtocol, wssServer, aesCrypto, exchangeRepository, usersRepository)

    await exchangeMonitorUseCase.execute()
  }
}
