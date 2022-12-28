import { Request, Response } from 'express'
import { StartMonitor } from './../utils/startMonitor'

export class StartMonitorController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { id } = request.params
    const { id: userId } = request.user

    await new StartMonitor().execute(id, userId)

    return response.sendStatus(202)
  }
}
