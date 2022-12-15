import { NodeBinanceApiAdapterInterface, OutputBalanceInterface } from '../../../helpers/adapters/nodeBinanceApi/interfaces/nodeBinanceApi-Interface'
import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'
import { AppError } from './../../../helpers/errors/appError'

interface GetBalanceUseCaseRequestInterface {
  id: string
}
export class GetBalaceUseCase {
  constructor (
    private readonly getSettingsDecrypted: GetSettingsDecryptedInterface,
    private readonly exchangeAdapter: NodeBinanceApiAdapterInterface
  ) { }

  async execute ({ id }: GetBalanceUseCaseRequestInterface): Promise<any> {
    const settings = await this.getSettingsDecrypted.handle({ userId: id })

    const balance = await this.exchangeAdapter.exchangeBalance(settings).catch(err => { throw new AppError(err.message || err.body) })

    const balanceWallet = Object.entries(balance as OutputBalanceInterface).map(([key, value]) => {
      return {
        symbol: key,
        available: value.available,
        onOrder: value.onOrder
      }
    })

    return balanceWallet
  }
}
