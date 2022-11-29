import WebSocket from 'ws'
import { AesCrypto } from '../../../helpers/adapters/aesCrypto'
import { GetSettingsDecrypted } from '../../../helpers/utils/getSettingsDecrypted'
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

    const getSettingsDecrypted = new GetSettingsDecrypted(usersRepository, aesCrypto)

    const exchangeMonitorUseCase = new ExchangeMonitorUseCase(userProtocol, wssServer, getSettingsDecrypted, exchangeRepository)

    await exchangeMonitorUseCase.execute()
  }
}
