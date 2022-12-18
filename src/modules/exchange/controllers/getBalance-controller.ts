import { Request, Response } from 'express'
import { AesCrypto } from '../../../helpers/adapters/aesCrypto/aesCrypto-adapter'
import { BinanceApiNodeAdapter } from '../../../helpers/adapters/binanceApiNode/binanceApiNode-adapter'
import { UsersRepository } from '../../users/repositories/users-repository'

import { GetSettingsDecrypted } from './../../../helpers/utils/getSettingsDecrypted'
import { GetBalaceUseCase } from './../use-cases/getBalance-useCase'

export class GetBalanceController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { id } = request.user

    const usersRepository = new UsersRepository()

    const aesCrypto = new AesCrypto()

    const getSettingsDecrypted = new GetSettingsDecrypted(usersRepository, aesCrypto)

    const binanceApiNodeAdapter = new BinanceApiNodeAdapter()

    const getBalaceUseCase = new GetBalaceUseCase(getSettingsDecrypted, binanceApiNodeAdapter)

    const balance = await getBalaceUseCase.execute({ id })

    return response.send(balance)
  }
}
