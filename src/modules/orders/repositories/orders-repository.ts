import { prisma } from '../../../prisma'
import { InputCreateOrdersInterface, InputFindByIdInterface, InputFindByOrderIdAndClieantIdInterface, InputFindByUserIdInterface, InputGetOrdersInterface, InputUpdateOrdersInterface, OrderInterface, OrdersRepositoryInterface } from './../interfaces/orders-interface'

export class OrdersRepository implements OrdersRepositoryInterface {
  async findById ({ userId, id }: InputFindByIdInterface): Promise<OrderInterface | null> {
    const order = await prisma.order.findFirst({
      where: {
        userId,
        id
      }
    })

    return order
  }

  async findByUserId ({ userId }: InputFindByUserIdInterface): Promise<OrderInterface[] | null> {
    const orders = await prisma.order.findMany({
      where: {
        userId
      }
    })

    return orders
  }

  async findByOrderIdAndClieantId ({ orderId, clientOrderId }: InputFindByOrderIdAndClieantIdInterface): Promise<OrderInterface | null> {
    const order = await prisma.order.findFirst({
      where: {
        orderId,
        clientOrderId
      }
    })

    return order
  }

  async count (filter: string): Promise<number> {
    const countNumber = await prisma.order.count({
      where: {
        symbol: {
          contains: filter
        }
      }
    })

    return countNumber
  }

  async get (data: InputGetOrdersInterface): Promise<OrderInterface[]> {
    const take = 10
    const { userId, page, symbol } = data

    const orders = await prisma.order.findMany({
      where: {
        userId,
        symbol: {
          contains: symbol
        }
      },
      take,
      skip: take * ((page) - 1),
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return orders
  }

  async create (data: InputCreateOrdersInterface): Promise<void> {
    await prisma.order.create({
      data: {
        ...data
      }
    })
  }

  async update (data: InputUpdateOrdersInterface): Promise<OrderInterface> {
    const { clientOrderId, ...rest } = data

    const order = await prisma.order.update({
      where: {
        clientOrderId
      },
      data: {
        ...rest
      }
    })

    return order
  }
}
