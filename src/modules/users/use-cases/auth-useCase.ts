import { compare } from 'bcrypt';
import { MiddlewareError } from './../../../middlewares/middlewareError';

import { sign } from 'jsonwebtoken';
import { UsersRepositoryInterface } from '../interfaces/users-interface';

interface AuthenticateUserRequestUseCaseInterface {
  username: string;
  password: string;
}

interface AuthenticateUserResponseUseCaseInterface {
  username: string;
  token: string;
}

export class AuthUseCase {
  constructor(private usersRepository: UsersRepositoryInterface) {}

  async execute(request: AuthenticateUserRequestUseCaseInterface): Promise<AuthenticateUserResponseUseCaseInterface> {
    const { username, password } = request;

    const user = await this.usersRepository.findByUser(username);

    if (!user) {
      throw new MiddlewareError('user or password incorret!');
    }

    const passwordMach = await compare(password, user.password);

    if (!passwordMach) {
      throw new MiddlewareError('user or password incorret!');
    }

    const token = sign({}, process.env.SECRET as string, {
      subject: user.id,
      expiresIn: '1d'
    });

    return {
      token,
      username: user.username
    };
  }
}
