import { SymbolsInterface, SymbolsRepositoryInterface } from './../interfaces/symbols-interface'

export class GetSymbolsUseCase {
  constructor (private readonly symbolsRepository: SymbolsRepositoryInterface) { }

  async execute ({ userId }: { userId: string }): Promise<SymbolsInterface[]> {
    const symbols = await this.symbolsRepository.get({ userId })

    return symbols
  }
}
