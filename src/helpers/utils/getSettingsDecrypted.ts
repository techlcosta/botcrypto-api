import { AesCryptoAdapterInterface } from '../adapters/aesCrypto/aesCrypto-adapter'
import { SettingsInterface } from '../adapters/nodeBinanceApi/nodeBinanceApi-Interface'
import { AppError } from '../errors/appError'
import { UsersRepositoryInterface } from './../../modules/users/interfaces/users-interface'

interface InputGetSettingsDecryptedInterface {
  userId: string
}

export interface GetSettingsDecryptedInterface {
  handle: ({ userId }: InputGetSettingsDecryptedInterface) => Promise<SettingsInterface>
}

export class GetSettingsDecrypted implements GetSettingsDecryptedInterface {
  constructor (
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly aesCrypto: AesCryptoAdapterInterface

  ) { }

  async handle ({ userId }: InputGetSettingsDecryptedInterface): Promise<SettingsInterface> {
    const user = await this.usersRepository.findById({ id: userId })

    if (!user) throw new AppError('User not found')

    const settings = {
      APIKEY: user.accessKey,
      APISECRET: this.aesCrypto.decrypt(user.secretKey),
      urls: {
        base: user.apiURL,
        stream: user.streamURL
      }
    }

    return settings
  }
}
