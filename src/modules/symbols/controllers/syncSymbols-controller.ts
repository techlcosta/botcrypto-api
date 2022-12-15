import { Request, Response } from 'express'
import { AesCrypto } from '../../../helpers/adapters/aesCrypto/aesCrypto-adapter'
import { NodeBinanceApiAdapter } from '../../../helpers/adapters/nodeBinanceApi/functions/nodeBinanceApi-adapter'
import { GetSettingsDecrypted } from '../../../helpers/utils/getSettingsDecrypted'

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

    const nodeBinanceApiAdapter = new NodeBinanceApiAdapter()

    const syncSymbolsUseCase = new SyncSymbolsUseCase(getSettingsDecrypted, symbolsRepository, nodeBinanceApiAdapter)

    await syncSymbolsUseCase.execute(id)

    return response.send()
  }
}
