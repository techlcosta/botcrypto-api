import { Request, Response } from 'express'
import { UsersRepository } from '../repositories/users-repository'
import { UpdateUserUseCase } from './../use-cases/updateUser-useCase'

export class UpdateUserController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { password, apiURL, streamURL, accessKey, secretKey } = await request.body

    const { id } = request.user

    const usersRepository = new UsersRepository()

    const updateUserUseCase = new UpdateUserUseCase(usersRepository)

    const user = await updateUserUseCase.execute({
      id,
      password,
      apiURL,
      streamURL,
      accessKey,
      secretKey
    })

    return response.send(user)
  }
}
