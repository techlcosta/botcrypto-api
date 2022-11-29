import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'
import { ExchangeRepositoryInterface } from './../interfaces/exchange-interface'

interface GetBalanceUseCaseRequestInterface {
  id: string
}
export class GetBalaceUseCase {
  constructor (
    private readonly getSettingsDecrypted: GetSettingsDecryptedInterface,
    private readonly exchangeRepository: ExchangeRepositoryInterface
  ) { }

  async execute ({ id }: GetBalanceUseCaseRequestInterface): Promise<any> {
    const settings = await this.getSettingsDecrypted.handle({ userId: id })

    await this.exchangeRepository.setSettings(settings)

    const balance = await this.exchangeRepository.exchangeBalance()

    return balance
  }
}
