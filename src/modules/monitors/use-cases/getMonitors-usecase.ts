import { MonitorInterface, MonitorsRepositoryInterface } from '../interfaces/monitorsRepository-interface'

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
    private readonly monitorsRepository: MonitorsRepositoryInterface
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
