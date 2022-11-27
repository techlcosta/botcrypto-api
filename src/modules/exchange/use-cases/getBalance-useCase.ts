import { AesCryptoAdapterInterface } from '../../../helpers/adapters/aesCrypto'
import { AppError } from '../../../helpers/errors/appError'
import { UsersRepositoryInterface } from '../../users/interfaces/users-interface'
import { ExchangeRepositoryInterface } from './../interfaces/exchange-interface'

interface GetBalanceUseCaseRequestInterface {
  id: string
}
export class GetBalaceUseCase {
  constructor (
    private readonly userRepository: UsersRepositoryInterface,
    private readonly aesCrypto: AesCryptoAdapterInterface,
    private readonly exchangeRepository: ExchangeRepositoryInterface
  ) {}

  async execute ({ id }: GetBalanceUseCaseRequestInterface): Promise<any> {
    const user = await this.userRepository.findById(id)

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

    const balance = await this.exchangeRepository.exchangeBalance()

    return balance
  }
}
