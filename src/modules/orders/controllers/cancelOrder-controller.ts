import { Request, Response } from 'express'
import { AesCrypto } from '../../../helpers/adapters/aesCrypto'
import { GetSettingsDecrypted } from '../../../helpers/utils/getSettingsDecrypted'
import { ExchangeRepository } from '../../exchange/repositories/exchange-repository'
import { UsersRepository } from '../../users/repositories/users-repository'
import { OrdersRepository } from '../repositories/orders-repository'
import { CancelOrderUseCase } from './../use-cases/cancelOrder-useCase'

export class CancelOrderController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { symbol, orderId } = await request.body

    const { id: userId } = request.user

    const usersRepository = new UsersRepository()

    const aesCrypto = new AesCrypto()

    const getSettingsDecrypted = new GetSettingsDecrypted(usersRepository, aesCrypto)

    const exchangeRepository = new ExchangeRepository()

    const ordersRepository = new OrdersRepository()

    const cancelOrderUseCase = new CancelOrderUseCase(getSettingsDecrypted, exchangeRepository, ordersRepository)

    await cancelOrderUseCase.execute({
      userId,
      symbol,
      orderId
    })
    return response.status(204).send()
  }
}
