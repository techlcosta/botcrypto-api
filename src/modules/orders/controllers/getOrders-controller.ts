import { Request, Response } from 'express'
import { OrdersRepository } from '../repositories/orders-repository'
import { GetOdersUseCase } from './../use-cases/getOders-useCase'

export class GetOrdersController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { filter, page } = await request.body
    const { id: userId } = request.user
    const ordersRepository = new OrdersRepository()

    const getOdersUseCase = new GetOdersUseCase(ordersRepository)

    const orders = await getOdersUseCase.execute({
      userId,
      filter,
      page
    })

    return response.send(orders)
  }
}
