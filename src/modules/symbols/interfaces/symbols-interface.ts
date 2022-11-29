
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
  get: ({ userId }: InputGetSymbolsInterface) => Promise<SymbolsInterface[]>
  findBySymbol: ({ symbol, userId }: InputFindSymbolInterface) => Promise<SymbolsInterface | null>
  update: (data: InputUpdateSymbolsInterface) => Promise<void>
  delete: ({ id }: InputDeleteSymbolInterface) => Promise<void>
}
