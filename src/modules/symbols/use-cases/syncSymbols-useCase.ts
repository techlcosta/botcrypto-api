import { NodeBinanceApiAdapterInterface } from '../../../helpers/adapters/nodeBinanceApi/interfaces/nodeBinanceApi-Interface'
import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'
import { SymbolsRepositoryInterface } from '../interfaces/symbols-interface'

import { InputUpdateSymbolsInterface } from './../interfaces/symbols-interface'

export class SyncSymbolsUseCase {
  constructor (
    private readonly getSettingsDecrypted: GetSettingsDecryptedInterface,
    private readonly symbolsRepository: SymbolsRepositoryInterface,
    private readonly nodeBinanceApiAdapter: NodeBinanceApiAdapterInterface

  ) { }

  async execute (id: string): Promise<void> {
    const settings = await this.getSettingsDecrypted.handle({ userId: id })

    const exchangeInfo = await this.nodeBinanceApiAdapter.exchangeInfo(settings)

    const symbols: InputUpdateSymbolsInterface[] = exchangeInfo.symbols.map((symbol: any): InputUpdateSymbolsInterface => {
      const minNotionalFilter = symbol.filters.find((f: any) => f.filterType === 'MIN_NOTIONAL')
      const minLotSizeFilter = symbol.filters.find((f: any) => f.filterType === 'LOT_SIZE')
      return {
        symbol: symbol.symbol,
        base: symbol.baseAsset,
        quote: symbol.quoteAsset,
        basePrecision: symbol.baseAssetPrecision,
        quotePrecision: symbol.quoteAssetPrecision,
        minNotional: minNotionalFilter.minNotional || '1',
        minLotSize: minLotSizeFilter.minQty || '1',
        userId: id
      }
    })

    for (const symbol of symbols) {
      await this.symbolsRepository.update(symbol)
    }
  }
}
