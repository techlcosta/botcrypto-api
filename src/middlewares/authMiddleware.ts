import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { AppError } from '../helpers/errors/appError'
import { UsersRepository } from '../modules/users/repositories/users-repository'

interface PayloadInterface {
  sub: string
}

export async function AuthMiddleware (request: Request, response: Response, next: NextFunction): Promise<void> {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('Token missing', 401, 'invalid')
  }

  try {
    const [, token] = authHeader.split(' ')

    const { sub: userId } = verify(token, process.env.SECRET as string) as PayloadInterface

    const usersRepository = new UsersRepository()

    const user = await usersRepository.findById(userId)

    if (user == null) {
      throw new AppError('User does not exists', 401)
    }

    request.user = {
      id: userId
    }

    next()
  } catch (error) {
    console.error(error)
    throw new AppError('Token is missing or invalid!', 401, 'invalid')
  }
}
