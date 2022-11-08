import { compare } from 'bcrypt';
import { AppError } from '../../../helpers/errors/appError';

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
      throw new AppError('user or password incorret!', 401, 'invalid');
    }

    const passwordMach = await compare(password, user.password);

    if (!passwordMach) {
      throw new AppError('user or password incorret!', 401, 'invalid');
    }

    const token = sign({}, process.env.SECRET as string, {
      subject: user.id,
      expiresIn: process.env.JWT_EXPIRES
    });

    return {
      token,
      username: user.username
    };
  }
}
