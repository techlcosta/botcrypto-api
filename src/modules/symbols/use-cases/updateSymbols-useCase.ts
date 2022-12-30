import { InputUpdateSymbolsInterface, SymbolsRepositoryInterface } from '../interfaces/symbolsRepository-interface'
import { AppError } from './../../../helpers/errors/appError'

export class UpdateSymbolsUseCase {
  constructor (private readonly symbolsRepository: SymbolsRepositoryInterface) { }

  async execute (data: InputUpdateSymbolsInterface): Promise<void> {
    const symbol = await this.symbolsRepository.findBySymbol({ userId: data.userId, symbol: data.symbol })

    if (!symbol) throw new AppError(`This "${data.symbol}" symbol not found.`)

    await this.symbolsRepository.update(data)
  }
}
