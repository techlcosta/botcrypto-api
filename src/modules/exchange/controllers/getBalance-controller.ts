import { Request, Response } from 'express'
import { UsersRepository } from '../../users/repositories/users-repository'
import { AesCrypto } from './../../../helpers/adapters/aesCrypto'
import { GetSettingsDecrypted } from './../../../helpers/utils/getSettingsDecrypted'
import { ExchangeRepository } from './../repositories/exchange-repository'
import { GetBalaceUseCase } from './../use-cases/getBalance-useCase'

export class GetBalanceController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { id } = request.user

    const usersRepository = new UsersRepository()

    const aesCrypto = new AesCrypto()

    const getSettingsDecrypted = new GetSettingsDecrypted(usersRepository, aesCrypto)

    const exchangeRepository = new ExchangeRepository()

    const getBalaceUseCase = new GetBalaceUseCase(getSettingsDecrypted, exchangeRepository)

    const balance = await getBalaceUseCase.execute({ id })

    return response.send(balance)
  }
}
