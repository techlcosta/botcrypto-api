import { AutomationInterface, AutomationsRepositoryInterface } from '../interfaces/automationsRepository-interface'

interface RequestGetAutomationsInterface {
  page: number
  symbol?: string
  userId: string
}

interface ResponseGetAutomationsInterface {
  automations: AutomationInterface[]
  pages: number
}

export class GetAutomationsUseCase {
  constructor (
    private readonly automationsRepository: AutomationsRepositoryInterface
  ) { }

  async execute ({ page, symbol, userId }: RequestGetAutomationsInterface): Promise<ResponseGetAutomationsInterface> {
    const automations = await this.automationsRepository.get({ userId, symbol, page })

    const count = await this.automationsRepository.count({ userId, symbol })

    const pages = Math.ceil(count / 10)

    return {
      automations,
      pages
    }
  }
}
