import { Request, Response } from 'express'
import { UsersRepository } from '../repositories/users-repository'
import { AuthUseCase } from '../use-cases/authUser-useCase'

export class AuthController {
  async handle (request: Request, response: Response): Promise<Response> {
    const { username, password } = await request.body

    const usersRepository = new UsersRepository()

    const authUseCase = new AuthUseCase(usersRepository)

    const resp = await authUseCase.execute({
      username,
      password
    })

    return response.send(resp)
  }
}
