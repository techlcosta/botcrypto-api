import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'
import { SymbolsRepositoryInterface } from '../interfaces/symbols-interface'
import { ExchangeRepositoryInterface } from './../../exchange/interfaces/exchange-interface'
import { InputUpdateSymbolsInterface } from './../interfaces/symbols-interface'

export class SyncSymbolsUseCase {
  constructor (
    private readonly getSettingsDecrypted: GetSettingsDecryptedInterface,
    private readonly symbolsRepository: SymbolsRepositoryInterface,
    private readonly exchangeRepository: ExchangeRepositoryInterface

  ) { }

  async execute (id: string): Promise<void> {
    const settings = await this.getSettingsDecrypted.handle({ userId: id })

    await this.exchangeRepository.setSettings(settings)

    const exchangeInfo = await this.exchangeRepository.exchangeInfo()

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
