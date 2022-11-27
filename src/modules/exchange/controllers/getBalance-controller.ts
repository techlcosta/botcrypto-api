import { Request, Response } from 'express'
import { UsersRepository } from '../../users/repositories/users-repository'
import { AesCrypto } from './../../../helpers/adapters/aesCrypto'
import { ExchangeRepository } from './../repositories/exchange-repository'
import { GetBalaceUseCase } from './../use-cases/getBalance-useCase'

export class GetBalanceController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { id } = request.user

    const userRepository = new UsersRepository()

    const aesCrypto = new AesCrypto()

    const exchangeRepository = new ExchangeRepository()

    const getBalaceUseCase = new GetBalaceUseCase(userRepository, aesCrypto, exchangeRepository)

    const balance = await getBalaceUseCase.execute({ id })

    return response.send(balance)
  }
}
