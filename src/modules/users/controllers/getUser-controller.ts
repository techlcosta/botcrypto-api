import { Request, Response } from 'express'
import { UsersRepository } from './../repositories/usersRepository'
import { GetUserUseCase } from './../use-cases/getUser-useCase'

export class GetUserController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { id } = request.user

    const usersRepository = new UsersRepository()

    const getUserUseCase = new GetUserUseCase(usersRepository)

    const user = await getUserUseCase.execute({
      id
    })

    return response.send(user)
  }
}
