import { AesCryptoAdapterInterface } from '../../../helpers/adapters/aesCrypto'
import { UsersRepositoryInterface } from '../../users/interfaces/users-interface'
import { SymbolsRepositoryInterface } from '../interfaces/symbols-interface'
import { AppError } from './../../../helpers/errors/appError'
import { ExchangeRepositoryInterface } from './../../exchange/interfaces/exchange-interface'
import { InputUpdateSymbolsInterface } from './../interfaces/symbols-interface'

export class SyncSymbolsUseCase {
  constructor (
    private readonly userRepository: UsersRepositoryInterface,
    private readonly symbolsRepository: SymbolsRepositoryInterface,
    private readonly exchangeRepository: ExchangeRepositoryInterface,
    private readonly aesCrypto: AesCryptoAdapterInterface
  ) { }

  async execute (id: string): Promise<void> {
    const user = await this.userRepository.findById({ id })

    if (!user) throw new AppError('User not found')

    const settings = {
      APIKEY: user.accessKey,
      APISECRET: this.aesCrypto.decrypt(user.secretKey),
      urls: {
        base: user.apiURL,
        stream: user.streamURL
      }
    }

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
