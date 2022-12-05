import { Request, Response } from 'express'
import { AesCrypto } from '../../../helpers/adapters/aesCrypto'
import { GetSettingsDecrypted } from '../../../helpers/utils/getSettingsDecrypted'
import { ExchangeRepository } from '../../exchange/repositories/exchange-repository'
import { UsersRepository } from '../../users/repositories/users-repository'
import { OrdersRepository } from './../repositories/orders-repository'
import { NewOrderUseCase } from './../use-cases/newOrder-useCase'

export class NewOrderController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { side, symbol, quantity, limitPrice, type, options, automationId, isMaker } = await request.body

    const { id: userId } = request.user

    const usersRepository = new UsersRepository()

    const aesCrypto = new AesCrypto()

    const getSettingsDecrypted = new GetSettingsDecrypted(usersRepository, aesCrypto)

    const exchangeRepository = new ExchangeRepository()

    const ordersRepository = new OrdersRepository()

    const newOrderUseCase = new NewOrderUseCase(getSettingsDecrypted, exchangeRepository, ordersRepository)

    await newOrderUseCase.execute({
      side,
      symbol,
      quantity,
      limitPrice,
      type,
      options,
      automationId,
      isMaker,
      userId
    })

    return response.status(201).send()
  }
}
