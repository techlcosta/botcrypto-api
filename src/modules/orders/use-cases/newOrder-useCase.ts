import { AppError } from '../../../helpers/errors/appError'
import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'
import { ExchangeRepositoryInterface, SideOrderType, TypeOrderType } from '../../exchange/interfaces/exchange-interface'
import { OrdersRepositoryInterface } from '../interfaces/orders-interface'

interface RequestNewOrderInterface {
  side: SideOrderType
  symbol: string
  quantity: string
  limitPrice?: string
  type: TypeOrderType
  automationId?: string
  isMaker: boolean
  options: {
    stopPrice?: string
    icebergQuantity?: string
    type: string
  }
  userId: string
}

interface ResponseNewOrderBinanceInterface {
  symbol: string
  orderId: number
  price: string
  orderListId: number
  clientOrderId: string
  transactTime: bigint
  type: string
  status: string
}

export class NewOrderUseCase {
  constructor (
    private readonly getSettingsDecrypted: GetSettingsDecryptedInterface,
    private readonly exchangeRepository: ExchangeRepositoryInterface,
    private readonly ordersRepository: OrdersRepositoryInterface
  ) { }

  async execute ({ side, symbol, quantity, limitPrice, type, options, automationId, isMaker, userId }: RequestNewOrderInterface): Promise<void> {
    const settings = await this.getSettingsDecrypted.handle({ userId })

    await this.exchangeRepository.setSettings(settings)

    const price = limitPrice ? parseFloat(limitPrice) : undefined

    let response: ResponseNewOrderBinanceInterface | undefined

    try {
      if (side === 'BUY') {
        response = await this.exchangeRepository.buy({ symbol, quantity: parseFloat(quantity), price, options: { type: options.type }, type })
      }

      if (side === 'SELL') {
        response = await this.exchangeRepository.sell({ symbol, quantity: parseFloat(quantity), price, options: { type: options.type }, type })
      }
    } catch (error: any) {
      console.log(error)
      throw new AppError(error.body ?? 'New order failed on Binance')
    }

    if (response) {
      await this.ordersRepository.create({
        side,
        symbol,
        quantity,
        limitPrice,
        type: response.type,
        automationId,
        isMaker,
        stopPrice: options.stopPrice,
        icebergQuantity: options.icebergQuantity,
        orderId: response.orderId,
        clientOrderId: response.clientOrderId,
        status: response.status,
        transactionTime: String(response.transactTime),
        userId
      })
    }
  }
}
