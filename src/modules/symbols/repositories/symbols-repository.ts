import { prisma } from './../../../prisma'
import { InputCountSymbolsInterface, InputDeleteSymbolInterface, InputFindSymbolInterface, InputGetSymbolsInterface, InputUpdateSymbolsInterface, SymbolsInterface, SymbolsRepositoryInterface } from './../interfaces/symbols-interface'

export class SymbolsRepository implements SymbolsRepositoryInterface {
  async get ({ userId, symbol, page, onlyFavorites }: InputGetSymbolsInterface): Promise<SymbolsInterface[]> {
    const take = 10
    const symbols = await prisma.symbol.findMany({
      where: {
        userId,
        symbol: symbol && symbol.length > 6
          ? symbol
          : { endsWith: symbol },
        isFavorite: onlyFavorites && true
      },
      take: page && take,
      skip: page && take * ((page) - 1)
    })

    return symbols
  }

  async count ({ symbol, userId, onlyFavorites }: InputCountSymbolsInterface): Promise<number> {
    const countNumber = await prisma.symbol.count({
      where: {
        userId,
        symbol: symbol && symbol.length > 6
          ? symbol
          : { endsWith: symbol },
        isFavorite: onlyFavorites && true
      }
    })

    return countNumber
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
