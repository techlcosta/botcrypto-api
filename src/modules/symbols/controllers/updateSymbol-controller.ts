import { Request, Response } from 'express'
import { SymbolsRepository } from '../repositories/symbols-repository'
import { UpdateSymbolsUseCase } from './../use-cases/updateSymbols-useCase'

export class UpdateSymbolController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { symbol, base, quote, basePrecision, quotePrecision, minNotional, minLotSize, isFavorite } = await request.body

    const symbolsRepository = new SymbolsRepository()

    const updateSymbolsUseCase = new UpdateSymbolsUseCase(symbolsRepository)

    await updateSymbolsUseCase.execute({
      symbol,
      base,
      quote,
      basePrecision,
      quotePrecision,
      minNotional,
      minLotSize,
      isFavorite
    })

    return response.send()
  }
}
