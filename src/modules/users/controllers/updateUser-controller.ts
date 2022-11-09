import { Request, Response } from 'express'
import { UsersRepository } from './../repositories/usersRepository'
import { UpdateUserUseCase } from './../use-cases/updateUser-useCase'

export class UpdateUserController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { password, apiURL, accessKey, secretKey } = await request.body

    const { id } = request.user

    const usersRepository = new UsersRepository()

    const updateUserUseCase = new UpdateUserUseCase(usersRepository)

    const user = await updateUserUseCase.execute({
      id,
      password,
      apiURL,
      accessKey,
      secretKey
    })

    return response.send(user)
  }
}
