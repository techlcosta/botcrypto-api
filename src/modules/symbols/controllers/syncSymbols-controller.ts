import { Request, Response } from 'express'
import { AesCrypto } from '../../../helpers/adapters/aesCrypto'
import { GetSettingsDecrypted } from '../../../helpers/utils/getSettingsDecrypted'
import { ExchangeRepository } from '../../exchange/repositories/exchange-repository'
import { UsersRepository } from '../../users/repositories/users-repository'
import { SymbolsRepository } from '../repositories/symbols-repository'
import { SyncSymbolsUseCase } from './../use-cases/syncSymbols-useCase'

export class SyncSymbolsController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { id } = request.user
    const usersRepository = new UsersRepository()

    const aesCrypto = new AesCrypto()

    const getSettingsDecrypted = new GetSettingsDecrypted(usersRepository, aesCrypto)

    const symbolsRepository = new SymbolsRepository()

    const exchangeRepository = new ExchangeRepository()

    const syncSymbolsUseCase = new SyncSymbolsUseCase(getSettingsDecrypted, symbolsRepository, exchangeRepository)

    await syncSymbolsUseCase.execute(id)

    return response.send()
  }
}
