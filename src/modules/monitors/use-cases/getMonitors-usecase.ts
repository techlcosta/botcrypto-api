import { MonitorInterface } from '../interfaces/monitors-interface'
import { MonitorsRepository } from '../repositories/monitors-repository'

interface RequestGetMonitorsInterface {
  page: number
  symbol?: string
  userId: string
}
interface ResponseGetMonitorsInterface {
  monitors: MonitorInterface[]
  pages: number
}
export class GetMonitorsUseCase {
  constructor (
    private readonly monitorsRepository: MonitorsRepository
  ) { }

  async execute ({ userId, symbol, page }: RequestGetMonitorsInterface): Promise<ResponseGetMonitorsInterface> {
    const monitors = await this.monitorsRepository.get({ userId, symbol, page })

    const count = await this.monitorsRepository.count({ userId, symbol })

    const pages = Math.ceil(count / 10)

    return {
      monitors,
      pages
    }
  }
}
