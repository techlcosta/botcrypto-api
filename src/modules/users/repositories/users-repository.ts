import { prisma } from '../../../prisma'
import { InputUpdateUserInterface, UserInterface, UsersRepositoryInterface } from '../interfaces/users-interface'
import { InputFindUserByIdInterface, InputFindUserByUserNameInterface } from './../interfaces/users-interface'

export class UsersRepository implements UsersRepositoryInterface {
  async findById ({ id }: InputFindUserByIdInterface): Promise<UserInterface | null> {
    const response = await prisma.user.findFirst({
      where: {
        id
      }
    })

    return response
  }

  async findByUser ({ username }: InputFindUserByUserNameInterface): Promise<UserInterface | null> {
    const response = await prisma.user.findFirst({
      where: {
        username
      }
    })

    return response
  }

  async update (data: InputUpdateUserInterface): Promise<UserInterface> {
    const { id, ...rest } = data
    const response = await prisma.user.update({
      where: {
        id
      },
      data: {
        ...rest
      }
    })

    return response
  }
}
