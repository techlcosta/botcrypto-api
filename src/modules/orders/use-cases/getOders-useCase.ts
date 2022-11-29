import { InputGetOrdersInterface, OrderInterface, OrdersRepositoryInterface } from './../interfaces/orders-interface'
interface OutputGetOrdersInterface {
  orders: OrderInterface[]
  pages: number
}
export class GetOdersUseCase {
  constructor (
    private readonly ordersRepository: OrdersRepositoryInterface
  ) { }

  async execute ({ userId, filter, page }: InputGetOrdersInterface): Promise<OutputGetOrdersInterface> {
    const orders = await this.ordersRepository.get({ userId, filter, page })

    const pages = Math.ceil(orders.length / 10)

    return {
      orders,
      pages
    }
  }
}
