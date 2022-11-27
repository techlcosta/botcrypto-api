import { Request, Response } from 'express'
import { UsersRepository } from '../repositories/users-repository'
import { GetUserInfosUseCase } from '../use-cases/getUserInfos-useCase'

export class GetUserInfosController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { id } = request.user

    const usersRepository = new UsersRepository()

    const getUserInfosUseCase = new GetUserInfosUseCase(usersRepository)

    const user = await getUserInfosUseCase.execute({
      id
    })

    return response.send(user)
  }
}
