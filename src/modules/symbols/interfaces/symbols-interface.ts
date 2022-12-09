
export interface SymbolsInterface {
  id: string
  symbol: string
  base: string
  quote: string
  basePrecision: number
  quotePrecision: number
  minNotional: string
  minLotSize: string
  isFavorite: boolean
  userId: string
  updatedAt: Date
  createdAt: Date
}

export interface InputCreateSymbolsInterface {
  symbol: string
  base: string
  quote: string
  basePrecision: number
  quotePrecision: number
  minNotional: string
  minLotSize: string
}

export interface InputGetSymbolsInterface {
  userId: string
  page?: number
  symbol?: string
  onlyFavorites?: boolean
}

export interface InputCountSymbolsInterface {
  userId: string
  symbol?: string
  onlyFavorites?: boolean
}

export interface InputFindSymbolInterface {
  userId: string
  symbol: string
}

export interface InputUpdateSymbolsInterface {
  symbol: string
  base?: string
  quote?: string
  basePrecision?: number
  quotePrecision?: number
  minNotional?: string
  minLotSize?: string
  isFavorite?: boolean
  userId: string
}

export interface InputDeleteSymbolInterface {
  id: string
}

export interface SymbolsRepositoryInterface {
  get: (data: InputGetSymbolsInterface) => Promise<SymbolsInterface[]>
  count: (data: InputCountSymbolsInterface) => Promise<number>
  findBySymbol: (data: InputFindSymbolInterface) => Promise<SymbolsInterface | null>
  update: (data: InputUpdateSymbolsInterface) => Promise<void>
  delete: (data: InputDeleteSymbolInterface) => Promise<void>
}
