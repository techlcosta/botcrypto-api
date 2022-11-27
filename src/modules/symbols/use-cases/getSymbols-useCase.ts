import { SymbolsInterface, SymbolsRepositoryInterface } from './../interfaces/symbols-interface'

export class GetSymbolsUseCase {
  constructor (private readonly symbolsRepository: SymbolsRepositoryInterface) { }

  async execute (): Promise<SymbolsInterface[]> {
    const symbols = await this.symbolsRepository.get()

    return symbols
  }
}
