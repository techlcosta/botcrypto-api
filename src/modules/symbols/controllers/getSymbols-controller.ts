import { Request, Response } from 'express'
import { SymbolsRepository } from './../repositories/symbols-repository'
import { GetSymbolsUseCase } from './../use-cases/getSymbols-useCase'

export class GetSymbolsController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user
    const symbolsRepository = new SymbolsRepository()

    const getSymbolsUseCase = new GetSymbolsUseCase(symbolsRepository)

    const symbols = await getSymbolsUseCase.execute({ userId })

    return response.send(symbols)
  }
}
