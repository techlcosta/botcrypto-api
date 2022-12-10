import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'
import { ExchangeRepositoryInterface, ResponseOrderStatusInterface, ResponseOrdertradeInterface } from '../../exchange/interfaces/exchange-interface'
import { OrdersRepositoryInterface } from '../interfaces/orders-interface'
import { AppError } from './../../../helpers/errors/appError'
import { OrderInterface } from './../interfaces/orders-interface'

interface RequestSyncOrderInterface {
  userId: string
  id: string
}
export class SyncOrderUseCase {
  constructor (
    private readonly getSettingsDecrypted: GetSettingsDecryptedInterface,
    private readonly exchangeRepository: ExchangeRepositoryInterface,
    private readonly ordersRepository: OrdersRepositoryInterface
  ) { }

  async execute ({ userId, id }: RequestSyncOrderInterface): Promise<OrderInterface> {
    const settings = await this.getSettingsDecrypted.handle({ userId })

    const order = await this.ordersRepository.findById({ id, userId })

    if (!order) throw new AppError('Order not found!')

    let orderTrade: ResponseOrdertradeInterface

    let orderStatus: ResponseOrderStatusInterface

    try {
      await this.exchangeRepository.setSettings(settings)

      orderStatus = await this.exchangeRepository.orderStatus({ orderId: order.orderId, symbol: order.symbol })

      if (orderStatus.status !== 'FILLED') {
        const updatedOrder = await this.ordersRepository.update({
          clientOrderId: order.clientOrderId,
          quantity: orderStatus.origQty,
          status: orderStatus.status
        })

        return updatedOrder
      }

      orderTrade = await this.exchangeRepository.orderTrade({ orderId: order.orderId, symbol: order.symbol })
    } catch (error: any) {
      console.error(error)

      throw new AppError(error.body)
    }

    console.log(orderStatus, orderTrade)
    const quoteQuantity = parseFloat(orderStatus.cummulativeQuoteQty)
    const avgPrice = (quoteQuantity / parseFloat(orderStatus.executedQty)).toString()
    const net = orderTrade.commissionAsset && order.symbol.endsWith(orderTrade.commissionAsset)
      ? (quoteQuantity - parseFloat(orderTrade.commission)).toString()
      : quoteQuantity.toString()

    const updatedOrder = await this.ordersRepository.update({
      clientOrderId: order.clientOrderId,
      avgPrice,
      quantity: orderStatus.executedQty,
      status: orderStatus.status,
      transactionTime: orderStatus.updateTime.toString(),
      isMaker: orderTrade.isMaker,
      comission: orderTrade.commission,
      net
    })

    return updatedOrder
  }
}
