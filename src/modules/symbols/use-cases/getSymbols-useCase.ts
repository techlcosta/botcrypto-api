import { SymbolsInterface, SymbolsRepositoryInterface } from '../interfaces/symbolsRepository-interface'

interface RequestGetSymbolsInterface {
  page?: number
  symbol?: string
  onlyFavorites?: boolean
  userId: string
}
interface ResponseGetSymbolsInterface {
  symbols: SymbolsInterface[]
  pages: number
}
export class GetSymbolsUseCase {
  constructor (private readonly symbolsRepository: SymbolsRepositoryInterface) { }

  async execute ({ userId, page, symbol, onlyFavorites }: RequestGetSymbolsInterface): Promise<ResponseGetSymbolsInterface> {
    const count = await this.symbolsRepository.count({ userId, symbol, onlyFavorites })
    const symbols = await this.symbolsRepository.get({ userId, page, symbol, onlyFavorites })

    const pages = Math.ceil(count / 10)

    return { symbols, pages }
  }
}
