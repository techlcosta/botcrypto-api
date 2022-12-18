import { Request, Response } from 'express'
import { AesCrypto } from '../../../helpers/adapters/aesCrypto/aesCrypto-adapter'
import { BinanceApiNodeAdapter } from '../../../helpers/adapters/binanceApiNode/binanceApiNode-adapter'
import { GetSettingsDecrypted } from '../../../helpers/utils/getSettingsDecrypted'
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

    const binanceApiNodeAdapter = new BinanceApiNodeAdapter()

    const ordersRepository = new OrdersRepository()

    const cancelOrderUseCase = new CancelOrderUseCase(getSettingsDecrypted, binanceApiNodeAdapter, ordersRepository)

    const order = await cancelOrderUseCase.execute({
      userId,
      symbol,
      orderId
    })
    return response.send(order)
  }
}
