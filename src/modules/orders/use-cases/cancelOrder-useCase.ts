import { BinanceApiNodeAdapterInterface } from '../../../helpers/adapters/binanceApiNode/binanceApiNode-interface'
import { AppError } from '../../../helpers/errors/appError'
import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'

import { OrderInterface, OrdersRepositoryInterface } from '../interfaces/ordersRepository-interface'

interface RequestCancelOrderUseCaseInterface {
  symbol: string
  orderId: string
  userId: string
}

interface ResponseCancelOrderBinanceInterface {
  symbol: string
  origClientOrderId: string
  orderId: number
  orderListId: number
  clientOrderId: string
  price: string
  origQty: string
  executedQty: string
  cummulativeQuoteQty: string
  status: string
  timeInForce: string
  type: string
  side: string
}

export class CancelOrderUseCase {
  constructor (
    private readonly getSettingsDecrypted: GetSettingsDecryptedInterface,
    private readonly binanceApiNodeAdapter: BinanceApiNodeAdapterInterface,
    private readonly ordersRepository: OrdersRepositoryInterface
  ) { }

  async execute ({ symbol, orderId, userId }: RequestCancelOrderUseCaseInterface): Promise<OrderInterface> {
    const settings = await this.getSettingsDecrypted.handle({ userId })

    try {
      const response: ResponseCancelOrderBinanceInterface = await this.binanceApiNodeAdapter.cancel({ symbol, orderId: Number(orderId), settings })

      const order = await this.ordersRepository.update({
        clientOrderId: response.origClientOrderId,
        quantity: response.executedQty,
        status: response.status
      })

      return order
    } catch (error: any) {
      console.log(error)
      throw new AppError(error.body ?? 'Cancel order failed on Binance')
    }
  }
}
