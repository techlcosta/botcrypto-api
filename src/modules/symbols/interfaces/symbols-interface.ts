
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

export interface InputFindSymbolInterface {
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
}

export interface InputDeleteSymbolInterface {
  id: string
}

export interface SymbolsRepositoryInterface {
  get: () => Promise<SymbolsInterface[]>
  findBySymbol: ({ symbol }: InputFindSymbolInterface) => Promise<SymbolsInterface | null>
  update: (data: InputUpdateSymbolsInterface) => Promise<void>
  delete: ({ id }: InputDeleteSymbolInterface) => Promise<void>
}
