import { NodeBinanceApiAdapterInterface, OutputOrderStatusInterface, OutputOrdertradeInterface } from '../../../helpers/adapters/nodeBinanceApi/nodeBinanceApi-Interface'
import { GetSettingsDecryptedInterface } from '../../../helpers/utils/getSettingsDecrypted'

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
    private readonly nodeBinanceApiAdapter: NodeBinanceApiAdapterInterface,
    private readonly ordersRepository: OrdersRepositoryInterface
  ) { }

  async execute ({ userId, id }: RequestSyncOrderInterface): Promise<OrderInterface> {
    const settings = await this.getSettingsDecrypted.handle({ userId })

    const order = await this.ordersRepository.findById({ id, userId })

    if (!order) throw new AppError('Order not found!')

    let orderTrade: OutputOrdertradeInterface

    let orderStatus: OutputOrderStatusInterface

    try {
      orderStatus = await this.nodeBinanceApiAdapter.orderStatus({ orderId: order.orderId, symbol: order.symbol, settings })

      if (orderStatus.status !== 'FILLED') {
        const updatedOrder = await this.ordersRepository.update({
          clientOrderId: order.clientOrderId,
          quantity: orderStatus.origQty,
          status: orderStatus.status
        })

        return updatedOrder
      }

      orderTrade = await this.nodeBinanceApiAdapter.orderTrade({ orderId: order.orderId, symbol: order.symbol, settings })
    } catch (error: any) {
      console.error(error)

      throw new AppError(error.body)
    }

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
