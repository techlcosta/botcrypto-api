import { Request, Response } from 'express'
import { AutomationsRepository } from './../repositories/automations-repository'
import { GetAutomationsUseCase } from './../use-cases/getAutomations-useCase'

export class GetAutomationsController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { symbol } = request.params

    const { page } = request.query

    const { id: userId } = request.user

    const automationsRepository = new AutomationsRepository()

    const getAutomationsUseCase = new GetAutomationsUseCase(automationsRepository)

    const automations = await getAutomationsUseCase.execute({
      userId,
      symbol,
      page: Number(page) || 1
    })

    return response.send(automations)
  }
}
