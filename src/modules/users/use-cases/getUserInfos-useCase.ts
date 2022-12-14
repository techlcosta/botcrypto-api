import { AppError } from '../../../helpers/errors/appError'
import { UsersRepositoryInterface } from '../interfaces/usersRepository-interface'

interface GetUserInfosUseCaseRequestInterface {
  id: string
}

interface GetUserInfosUseCaseResponseInterface {
  id: string
  username: string
  apiURL: string
  streamURL: string
  accessKey: string
}

export class GetUserInfosUseCase {
  constructor (private readonly usersRepository: UsersRepositoryInterface) { }

  async execute ({ id }: GetUserInfosUseCaseRequestInterface): Promise<GetUserInfosUseCaseResponseInterface> {
    const user = await this.usersRepository.findById({ id })

    if (user == null) throw new AppError('User not found!')

    return {
      id: user.id,
      username: user.username,
      apiURL: user.apiURL,
      streamURL: user.streamURL,
      accessKey: user.accessKey
    } as GetUserInfosUseCaseResponseInterface
  }
}
