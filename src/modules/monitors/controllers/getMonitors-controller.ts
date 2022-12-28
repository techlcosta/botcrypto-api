import { Request, Response } from 'express'
import { GetMonitorsUseCase } from '../use-cases/getMonitors-useCase'
import { MonitorsRepository } from './../repositories/monitors-repository'

export class GetMonitorsController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { symbol } = request.params

    const { page } = request.query

    const { id: userId } = request.user

    const monitorsRepository = new MonitorsRepository()

    const getMonitorsUseCase = new GetMonitorsUseCase(monitorsRepository)

    const monitors = await getMonitorsUseCase.execute({
      userId,
      symbol,
      page: Number(page ?? 1)
    })

    return response.send(monitors)
  }
}
