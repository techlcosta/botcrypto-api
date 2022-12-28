import { Request, Response } from 'express'
import { RobotRepository } from '../../robot/repositories/robot-repository'
import { MonitorsRepository } from '../repositories/monitors-repository'
import { RemoveMonitorUseCase } from './../use-cases/removeMonitor-useCase'

export class RemoveMonitorController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const { id: userId } = request.user

    const monitorsRepository = new MonitorsRepository()

    const robotRepository = new RobotRepository()

    const removeMonitorUseCase = new RemoveMonitorUseCase(monitorsRepository, robotRepository)

    await removeMonitorUseCase.execute({ id, userId })

    return response.sendStatus(204)
  }
}
