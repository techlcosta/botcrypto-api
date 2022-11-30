import { OrdersRepositoryInterface } from '../interfaces/orders-interface'

interface RequestNewOrderInterface {
  side: string
  symbol: string
  quantity: string
  limitPrice?: string
  type: string
  automationId?: string
  isMaker: boolean
  options: {
    stopPrice?: string
    icebergQuantity?: string

  }
  userId: string
}

export class NewOrderUseCase {
  constructor (
    private readonly ordersRepository: OrdersRepositoryInterface
  ) { }

  async execute ({ side, symbol, quantity, limitPrice, type, options, automationId, isMaker, userId }: RequestNewOrderInterface): Promise<void> {
    await this.ordersRepository.create({
      side,
      symbol,
      quantity,
      limitPrice,
      type,
      automationId,
      isMaker,
      stopPrice: options.stopPrice,
      icebergQuantity: options.icebergQuantity,
      orderId: '1',
      clientOrderId: '1',
      status: '',
      transactionTime: Date.now(),
      userId
    })
  }
}
