import { Request, Response } from 'express'
import { SymbolsRepository } from './../repositories/symbols-repository'
import { GetSymbolsUseCase } from './../use-cases/getSymbols-useCase'

export class GetSymbolsController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { symbol } = request.params

    const { page, onlyFavorites } = request.query

    const { id: userId } = request.user

    const symbolsRepository = new SymbolsRepository()

    const getSymbolsUseCase = new GetSymbolsUseCase(symbolsRepository)

    const symbols = await getSymbolsUseCase.execute({
      userId,
      symbol,
      page: page ? Number(page) : undefined,
      onlyFavorites: onlyFavorites === 'true' ? true : undefined
    })

    return response.send(symbols)
  }
}
