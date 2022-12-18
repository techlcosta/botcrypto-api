import { OrderType } from 'binance-api-node'
import { BinanceApiNodeAdapterInterface, OutputNewOrder } from '../../../helpers/adapters/binanceApiNode/binanceApiNode-interface'
import { SideOrderTypes, TypeOrderTypes } from '../../../helpers/adapters/nodeBinanceApi/nodeBinanceApi-Interface'
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
  stopPrice?: string
  icebergQuantity?: string
  userId: string
}

export class NewOrderUseCase {
  constructor (
    private readonly getSettingsDecrypted: GetSettingsDecryptedInterface,
    private readonly binanceApiNodeAdapter: BinanceApiNodeAdapterInterface,
    private readonly ordersRepository: OrdersRepositoryInterface
  ) { }

  async execute ({ side, symbol, quantity, limitPrice, type, stopPrice, icebergQuantity, automationId, isMaker, userId }: RequestNewOrderInterface): Promise<void> {
    const settings = await this.getSettingsDecrypted.handle({ userId })

    const price = limitPrice

    let response: OutputNewOrder | undefined

    switch (type) {
      case 'LIMIT':
        if (price) response = await this.binanceApiNodeAdapter.newOrder(settings, { type: OrderType.LIMIT, price, quantity, side, symbol })
        break

      default:
        response = await this.binanceApiNodeAdapter.newOrder(settings, { type: OrderType.MARKET, quantity, symbol, side }).catch()
        break
    }

    if (response) {
      const { side, symbol, origQty, price, type, stopPrice, icebergQty, orderId, clientOrderId, status, transactTime } = response
      await this.ordersRepository.create({
        side,
        symbol,
        quantity: origQty,
        limitPrice: price,
        type,
        automationId,
        isMaker,
        stopPrice,
        icebergQuantity: icebergQty,
        orderId,
        clientOrderId,
        status,
        transactionTime: String(transactTime),
        userId
      })
    }
  }
}
