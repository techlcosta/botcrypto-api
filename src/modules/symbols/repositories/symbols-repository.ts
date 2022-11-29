import { prisma } from './../../../prisma'
import { InputDeleteSymbolInterface, InputFindSymbolInterface, InputGetSymbolsInterface, InputUpdateSymbolsInterface, SymbolsInterface, SymbolsRepositoryInterface } from './../interfaces/symbols-interface'

export class SymbolsRepository implements SymbolsRepositoryInterface {
  async get ({ userId }: InputGetSymbolsInterface): Promise<SymbolsInterface[]> {
    const symbols = await prisma.symbol.findMany({
      where: {
        userId
      }
    })

    return symbols
  }

  async findBySymbol ({ symbol, userId }: InputFindSymbolInterface): Promise<SymbolsInterface | null> {
    return await prisma.symbol.findFirst({
      where: {
        userId,
        symbol
      }
    })
  }

  async update (data: InputUpdateSymbolsInterface): Promise<void> {
    const { symbol, userId, ...rest } = data

    const alredyExists = await prisma.symbol.findFirst({
      where: {
        userId,
        symbol
      }
    })

    if (alredyExists) {
      await prisma.symbol.update({
        where: {
          id: alredyExists.id
        },
        data: { ...rest }
      })
    } else {
      await prisma.symbol.create({
        data: {
          symbol: data.symbol,
          base: data.base as string,
          quote: data.quote as string,
          basePrecision: data.basePrecision as number,
          quotePrecision: data.quotePrecision as number,
          minNotional: data.minNotional as string,
          minLotSize: data.minLotSize as string,
          userId: data.userId
        }
      })
    }
  }

  async delete ({ id }: InputDeleteSymbolInterface): Promise<void> {
    await prisma.symbol.delete({
      where: {
        id
      }
    })
  }
}
