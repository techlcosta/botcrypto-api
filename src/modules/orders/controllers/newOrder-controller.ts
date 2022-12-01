import { Request, Response } from 'express'
import { OrdersRepository } from './../repositories/orders-repository'
import { NewOrderUseCase } from './../use-cases/newOrder-useCase'

export class NewOrderController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { side, symbol, quantity, limitPrice, type, options, automationId, isMaker } = await request.body
    console.log(request.body)
    const { id: userId } = request.user

    const ordersRepository = new OrdersRepository()

    const newOrderUseCase = new NewOrderUseCase(ordersRepository)

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
