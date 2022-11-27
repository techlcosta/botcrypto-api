import { AppError } from './../../../helpers/errors/appError'
import { InputUpdateSymbolsInterface, SymbolsRepositoryInterface } from './../interfaces/symbols-interface'

export class UpdateSymbolsUseCase {
  constructor (private readonly symbolsRepository: SymbolsRepositoryInterface) { }

  async execute (data: InputUpdateSymbolsInterface): Promise<void> {
    const symbol = await this.symbolsRepository.findBySymbol(data.symbol)

    if (!symbol) throw new AppError(`This "${data.symbol}" symbol not found.`)

    await this.symbolsRepository.update(data)
  }
}
