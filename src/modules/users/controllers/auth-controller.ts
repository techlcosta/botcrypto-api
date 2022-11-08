import { Request, Response } from 'express';
import { UsersRepository } from './../repositories/usersRepository';
import { AuthUseCase } from './../use-cases/auth-useCase';

export class AuthController {
  async handle(request: Request, response: Response) {
    const { username, password } = await request.body;

    const usersRepository = new UsersRepository();

    const authUseCase = new AuthUseCase(usersRepository);

    const resp = await authUseCase.execute({
      username,
      password
    });

    return response.send(resp);
  }
}
