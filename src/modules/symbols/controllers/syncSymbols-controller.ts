import { Request, Response } from 'express'
import { AesCrypto } from '../../../helpers/adapters/aesCrypto'
import { ExchangeRepository } from '../../exchange/repositories/exchange-repository'
import { UsersRepository } from '../../users/repositories/users-repository'
import { SymbolsRepository } from '../repositories/symbols-repository'
import { SyncSymbolsUseCase } from './../use-cases/syncSymbols-useCase'

export class SyncSymbolsController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { id } = request.user
    const usersRepository = new UsersRepository()

    const symbolsRepository = new SymbolsRepository()

    const aesCrypto = new AesCrypto()

    const exchangeRepository = new ExchangeRepository()

    const syncSymbolsUseCase = new SyncSymbolsUseCase(usersRepository, symbolsRepository, exchangeRepository, aesCrypto)

    await syncSymbolsUseCase.execute(id)

    return response.send()
  }
}
