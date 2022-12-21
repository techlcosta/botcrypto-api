import { BinanceApiNodeAdapterInterface } from '../../../helpers/adapters/binanceApiNode/binanceApiNode-interface'
import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'
import { AppError } from './../../../helpers/errors/appError'

interface GetBalanceUseCaseRequestInterface {
  id: string
}
export class GetBalaceUseCase {
  constructor (
    private readonly getSettingsDecrypted: GetSettingsDecryptedInterface,
    private readonly binanceApiNodeAdapter: BinanceApiNodeAdapterInterface

  ) { }

  async execute ({ id }: GetBalanceUseCaseRequestInterface): Promise<any> {
    const settings = await this.getSettingsDecrypted.handle({ userId: id })

    const balance = await this.binanceApiNodeAdapter.exchangeBalance(settings).catch(err => { throw new AppError(err.message || err.body) })

    const balancesWallet = balance.balances.map((value) => {
      return {
        symbol: value.asset,
        available: value.free,
        onOrder: value.locked
      }
    })

    return balancesWallet
  }
}
