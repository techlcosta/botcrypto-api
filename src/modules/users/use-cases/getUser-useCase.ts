import { AppError } from './../../../helpers/errors/appError'
import { UsersRepositoryInterface } from './../interfaces/users-interface'

interface GetUserUseCaseRequestInterface {
  id: string
}

interface GetUserUseCaseResponseInterface {
  id: string
  username: string
  apiURL: string
  accessKey: string
}

export class GetUserUseCase {
  constructor (private readonly userRepository: UsersRepositoryInterface) {}

  async execute ({ id }: GetUserUseCaseRequestInterface): Promise<GetUserUseCaseResponseInterface> {
    const user = await this.userRepository.findById(id)

    if (user == null) throw new AppError('User not found!')

    return {
      id: user.id,
      username: user.username,
      apiURL: user.apiURL,
      accessKey: user.accessKey
    } as GetUserUseCaseResponseInterface
  }
}
