import { Request, Response } from 'express'
import { AesCrypto } from '../../../helpers/adapters/aesCrypto/aesCrypto-adapter'
import { BinanceApiNodeAdapter } from '../../../helpers/adapters/binanceApiNode/binanceApiNode-adapter'
import { GetSettingsDecrypted } from '../../../helpers/utils/getSettingsDecrypted'
import { UsersRepository } from '../../users/repositories/users-repository'
import { OrdersRepository } from './../repositories/orders-repository'
import { NewOrderUseCase } from './../use-cases/newOrder-useCase'

export class NewOrderController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { side, symbol, quantity, limitPrice, type, stopPrice, icebergQuantity, automationId, isMaker } = await request.body

    const { id: userId } = request.user

    const usersRepository = new UsersRepository()

    const aesCrypto = new AesCrypto()

    const getSettingsDecrypted = new GetSettingsDecrypted(usersRepository, aesCrypto)

    const binanceApiNodeAdapter = new BinanceApiNodeAdapter()

    const ordersRepository = new OrdersRepository()

    const newOrderUseCase = new NewOrderUseCase(getSettingsDecrypted, binanceApiNodeAdapter, ordersRepository)

    await newOrderUseCase.execute({
      side,
      symbol,
      quantity,
      limitPrice,
      type,
      stopPrice,
      icebergQuantity,
      automationId,
      isMaker,
      userId
    })

    return response.status(201).send()
  }
}
