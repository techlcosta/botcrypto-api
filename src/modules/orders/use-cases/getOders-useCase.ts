import { OrderInterface, OrdersRepositoryInterface } from './../interfaces/orders-interface'

interface RequestGetOrdersInterface {
  page: number
  symbol?: string
  userId: string
}
interface ResponseGetOrdersInterface {
  orders: OrderInterface[]
  pages: number
}
export class GetOdersUseCase {
  constructor (
    private readonly ordersRepository: OrdersRepositoryInterface
  ) { }

  async execute ({ userId, symbol, page }: RequestGetOrdersInterface): Promise<ResponseGetOrdersInterface> {
    const orders = await this.ordersRepository.get({ userId, symbol, page })

    const countOrders = await this.ordersRepository.count({ userId, symbol })

    const pages = Math.ceil(countOrders / 10)

    return {
      orders,
      pages
    }
  }
}
