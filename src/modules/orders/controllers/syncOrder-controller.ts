import { Request, Response } from 'express'
import { AesCrypto } from '../../../helpers/adapters/aesCrypto'
import { GetSettingsDecrypted } from '../../../helpers/utils/getSettingsDecrypted'
import { ExchangeRepository } from '../../exchange/repositories/exchange-repository'
import { UsersRepository } from '../../users/repositories/users-repository'
import { OrdersRepository } from '../repositories/orders-repository'
import { SyncOrderUseCase } from './../use-cases/syncOrders-useCase'

export class SyncOrderController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const { id: userId } = request.user

    console.log(id)

    const usersRepository = new UsersRepository()

    const aesCrypto = new AesCrypto()

    const getSettingsDecrypted = new GetSettingsDecrypted(usersRepository, aesCrypto)

    const exchangeRepository = new ExchangeRepository()

    const ordersRepository = new OrdersRepository()

    const syncOrderUseCase = new SyncOrderUseCase(getSettingsDecrypted, exchangeRepository, ordersRepository)

    const order = await syncOrderUseCase.execute({
      userId,
      id
    })

    return response.send(order)
  }
}
