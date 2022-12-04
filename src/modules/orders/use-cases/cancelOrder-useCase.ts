import { AppError } from '../../../helpers/errors/appError'
import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'
import { ExchangeRepositoryInterface } from '../../exchange/interfaces/exchange-interface'
import { OrdersRepositoryInterface } from '../interfaces/orders-interface'

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
    private readonly exchangeRepository: ExchangeRepositoryInterface,
    private readonly ordersRepository: OrdersRepositoryInterface
  ) { }

  async execute ({ symbol, orderId, userId }: RequestCancelOrderUseCaseInterface): Promise<void> {
    const settings = await this.getSettingsDecrypted.handle({ userId })

    await this.exchangeRepository.setSettings(settings)

    let response: ResponseCancelOrderBinanceInterface | undefined

    try {
      response = await this.exchangeRepository.cancel({ symbol, orderId: Number(orderId) })
    } catch (error: any) {
      console.log(error)
      throw new AppError(error.body ?? 'New order failed on Binance')
    }

    if (response) {
      await this.ordersRepository.update({
        clientOrderId: response.origClientOrderId,
        status: response.status
      })
    }
  }
}
