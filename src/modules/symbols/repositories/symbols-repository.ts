import { prisma } from './../../../prisma'
import { InputUpdateSymbolsInterface, SymbolsInterface, SymbolsRepositoryInterface } from './../interfaces/symbols-interface'

export class SymbolsRepository implements SymbolsRepositoryInterface {
  async get (): Promise<SymbolsInterface[]> {
    const symbols = await prisma.symbol.findMany({})

    return symbols
  }

  async findBySymbol (symbol: string): Promise<SymbolsInterface | null> {
    return await prisma.symbol.findFirst({
      where: {
        symbol
      }
    })
  }

  async update (data: InputUpdateSymbolsInterface): Promise<void> {
    const { symbol, ...rest } = data

    await prisma.symbol.upsert({
      where: {
        symbol: data.symbol
      },
      update: { ...rest },
      create: {
        symbol: data.symbol,
        base: data.base as string,
        quote: data.quote as string,
        basePrecision: data.basePrecision as number,
        quotePrecision: data.quotePrecision as number,
        minNotional: data.minNotional as string,
        minLotSize: data.minLotSize as string
      }
    })
  }

  async delete (id: string): Promise<void> {
    await prisma.symbol.delete({
      where: {
        id
      }
    })
  }
}
