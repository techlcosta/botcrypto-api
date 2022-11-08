import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import { UsersRepository } from '../modules/users/repositories/usersRepository';
import { MiddlewareError } from './middlewareError';

interface PayloadInterface {
  sub: string;
}

export async function MiddlewareAuthentication(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new MiddlewareError('Token missing', 401, 'invalid');
  }

  try {
    const [, token] = authHeader.split(' ');

    const { sub: userId } = verify(token, process.env.SECRET as string) as PayloadInterface;

    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new MiddlewareError('User does not exists', 401);
    }

    request.user = {
      id: userId
    };

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      if (error.message === 'jwt expired') {
        throw new MiddlewareError('Expired Token!', 401, 'expired');
      }
      throw new MiddlewareError('Token is missing or invalid!', 401, 'invalid');
    }
  }
}
