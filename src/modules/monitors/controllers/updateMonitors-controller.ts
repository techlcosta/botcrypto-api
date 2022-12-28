import { Request, Response } from 'express'
import { StartMonitor } from '../utils/startMonitor'
import { StopMonitor } from '../utils/stopMonitor'
import { MonitorsRepository } from './../repositories/monitors-repository'
import { UpdateMonitorUseCase } from './../use-cases/updateMonitor-useCase'

export class UpdateMonitorController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { id, symbol, type, isActive, broadcastLabel, interval, indexes } = await request.body
    const { id: userId } = request.user

    const monitorsRepository = new MonitorsRepository()

    const startMonitor = new StartMonitor()

    const stopMonitor = new StopMonitor()

    const updateMonitorUseCase = new UpdateMonitorUseCase(monitorsRepository, stopMonitor, startMonitor)

    const monitor = await updateMonitorUseCase.execute({
      id,
      symbol,
      type,
      isActive,
      broadcastLabel,
      interval,
      indexes,
      userId
    })

    return response.send(monitor)
  }
}
