import { Request, Response } from 'express'
import { OrdersRepository } from '../repositories/orders-repository'
import { GetOdersUseCase } from './../use-cases/getOders-useCase'

export class GetOrdersController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { symbol } = request.params

    const { page } = request.query

    const { id: userId } = request.user

    const ordersRepository = new OrdersRepository()

    const getOdersUseCase = new GetOdersUseCase(ordersRepository)

    const orders = await getOdersUseCase.execute({
      userId,
      symbol,
      page: Number(page) || 1
    })

    return response.send(orders)
  }
}
