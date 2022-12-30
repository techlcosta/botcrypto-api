import { AppError } from '../../../helpers/errors/appError'
import { UsersRepositoryInterface } from '../interfaces/usersRepository-interface'

interface UpdateUserUseCaseRquestInterface {
  id: string
  password?: string
  apiURL?: string
  streamURL?: string
  accessKey?: string
  secretKey?: string
}

interface UpdateUserUseCaseResponseInterface {
  id: string
  username: string
  apiURL: string
  streamURL: string
  accessKey: string
}

export class UpdateUserUseCase {
  constructor (private readonly usersRepository: UsersRepositoryInterface) { }

  async execute ({ id, password, apiURL, streamURL, accessKey, secretKey }: UpdateUserUseCaseRquestInterface): Promise<UpdateUserUseCaseResponseInterface> {
    const alreadyExistsUser = await this.usersRepository.findById({ id })

    if (alreadyExistsUser == null) throw new AppError('User not found!')

    const updatedUser = await this.usersRepository.update({
      id,
      password,
      apiURL,
      streamURL,
      accessKey,
      secretKey
    })

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      apiURL: updatedUser.apiURL,
      streamURL: updatedUser.streamURL,
      accessKey: updatedUser.accessKey
    } as UpdateUserUseCaseResponseInterface
  }
}
