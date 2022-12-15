import { NodeBinanceApiAdapterInterface, SideOrderTypes, TypeOrderTypes } from '../../../helpers/adapters/nodeBinanceApi/interfaces/nodeBinanceApi-Interface'
import { AppError } from '../../../helpers/errors/appError'
import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'

import { OrdersRepositoryInterface } from '../interfaces/orders-interface'

interface RequestNewOrderInterface {
  side: SideOrderTypes
  symbol: string
  quantity: string
  limitPrice?: string
  type: TypeOrderTypes
  automationId?: string
  isMaker: boolean
  options: {
    stopPrice?: string
    icebergQuantity?: string
    type: TypeOrderTypes
  }
  userId: string
}

interface ResponseNewOrderBinanceInterface {
  symbol: string
  orderId: number
  origQty: string
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
    private readonly nodeBinanceApiAdapter: NodeBinanceApiAdapterInterface,
    private readonly ordersRepository: OrdersRepositoryInterface
  ) { }

  async execute ({ side, symbol, quantity, limitPrice, type, options, automationId, isMaker, userId }: RequestNewOrderInterface): Promise<void> {
    const settings = await this.getSettingsDecrypted.handle({ userId })

    const price = limitPrice ? parseFloat(limitPrice) : undefined

    let response: ResponseNewOrderBinanceInterface | undefined

    try {
      if (side === 'BUY') {
        response = await this.nodeBinanceApiAdapter.buy({ symbol, quantity: parseFloat(quantity), price, options: { type: options.type }, type, settings })
      }

      if (side === 'SELL') {
        response = await this.nodeBinanceApiAdapter.sell({ symbol, quantity: parseFloat(quantity), price, options: { type: options.type }, type, settings })
      }
    } catch (error: any) {
      console.log(error)
      throw new AppError(error.body ?? 'New order failed on Binance')
    }

    if (response) {
      await this.ordersRepository.create({
        side,
        symbol,
        quantity: response.origQty,
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
