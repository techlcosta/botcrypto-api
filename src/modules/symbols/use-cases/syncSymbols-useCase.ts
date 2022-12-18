import { SymbolLotSizeFilter, SymbolMinNotionalFilter } from 'binance-api-node'
import { BinanceApiNodeAdapterInterface } from '../../../helpers/adapters/binanceApiNode/binanceApiNode-interface'
import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'
import { SymbolsRepositoryInterface } from '../interfaces/symbols-interface'

export class SyncSymbolsUseCase {
  constructor (
    private readonly getSettingsDecrypted: GetSettingsDecryptedInterface,
    private readonly symbolsRepository: SymbolsRepositoryInterface,
    private readonly binanceApiNodeAdapter: BinanceApiNodeAdapterInterface

  ) { }

  async execute (userId: string): Promise<void> {
    const settings = await this.getSettingsDecrypted.handle({ userId })

    const exchangeInfo = await this.binanceApiNodeAdapter.exchangeInfo(settings)

    for (const data of exchangeInfo.symbols) {
      const { symbol, baseAsset, quoteAsset, baseAssetPrecision, quoteAssetPrecision, filters } = data
      const minNotionalFilter = filters.find(f => f.filterType === 'MIN_NOTIONAL') as SymbolMinNotionalFilter | undefined
      const minLotSizeFilter = filters.find((f) => f.filterType === 'LOT_SIZE') as SymbolLotSizeFilter | undefined

      await this.symbolsRepository.update({
        symbol,
        base: baseAsset,
        quote: quoteAsset,
        basePrecision: baseAssetPrecision,
        quotePrecision: quoteAssetPrecision,
        minNotional: minNotionalFilter?.minNotional ?? '1',
        minLotSize: minLotSizeFilter?.minQty ?? '1',
        userId
      })
    }
  }
}
