import { Request, Response } from 'express'
import { StopMonitor } from './../utils/stopMonitor'

export class StopMonitorController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const { id: userId } = request.user

    await new StopMonitor().execute(id, userId)

    return response.sendStatus(202)
  }
}
