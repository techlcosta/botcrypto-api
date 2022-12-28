import { Request, Response } from 'express'
import { MonitorsRepository } from '../repositories/monitors-repository'
import { StartMonitor } from './../utils/startMonitor'

import { NewMonitorUseCase } from './../use-cases/newMonitor-useCase'

export class NewMonitorController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { symbol, type, isActive, broadcastLabel, interval, indexes } = await request.body
    const { id: userId } = request.user

    const monitorsRepository = new MonitorsRepository()

    const startMonitor = new StartMonitor()

    const newMonitorUseCase = new NewMonitorUseCase(monitorsRepository, startMonitor)

    await newMonitorUseCase.execute({
      symbol,
      type,
      isActive,
      broadcastLabel,
      indexes,
      interval,
      userId
    })

    return response.status(201).send()
  }
}
