import { prisma } from '../../../prisma'
import { InputUpdateUserInterface, UserInterface, UsersRepositoryInterface } from '../interfaces/users-interface'

export class UsersRepository implements UsersRepositoryInterface {
  async findById (id: string): Promise<UserInterface | null> {
    return await prisma.users.findFirst({
      where: {
        id
      }
    })
  }

  async findByUser (username: string): Promise<UserInterface | null> {
    return await prisma.users.findFirst({
      where: {
        username
      }
    })
  }

  async update (data: InputUpdateUserInterface): Promise<UserInterface> {
    const { id, ...rest } = data
    return await prisma.users.update({
      where: {
        id
      },
      data: {
        ...rest
      }
    })
  }
}
