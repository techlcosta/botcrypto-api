
export interface OrderInterface {
  id: string
  automationId?: string | null
  symbol: string
  orderId: string
  clientOrderId: string
  transactionTime: string
  type: string
  side: string
  quantity: string
  status: string
  icebergQuantity?: string | null
  obs?: string | null
  limitPrice?: string | null
  stopPrice?: string | null
  avgPrice?: string | null
  comission?: string | null
  net?: string | null
  isMaker: boolean
  userId: string
  updatedAt: Date
  createdAt: Date
}

export interface InputGetOrdersInterface {
  page?: number
  symbol?: string
  userId: string

}

export interface InputCreateOrdersInterface {
  automationId?: string
  symbol: string
  orderId: string
  clientOrderId: string
  transactionTime: string
  type: string
  side: string
  quantity: string
  status: string
  icebergQuantity?: string
  obs?: string
  limitPrice?: string
  stopPrice?: string
  avgPrice?: string
  comission?: string
  net?: string
  isMaker: boolean
  userId: string
}

export interface InputUpdateOrdersInterface {
  id: string
  automationId?: string
  symbol?: string
  transactionTime?: string
  type?: string
  side?: string
  quantity?: string
  status?: string
  icebergQuantity?: string
  obs?: string
  limitPrice?: string
  stopPrice?: string
  avgPrice?: string
  comission?: string
  net?: string
  isMaker?: boolean
}

export interface OrdersRepositoryInterface {
  findById: (userId: string, id: string) => Promise<OrderInterface | null>
  findByUserId: (userId: string) => Promise<OrderInterface[] | null>
  findByOrderIdAndClieantId: (orderId: string, clientOrderId: string) => Promise<OrderInterface | null>
  count: (filter: string) => Promise<number>
  get: (data: InputGetOrdersInterface) => Promise<OrderInterface[]>
  create: (data: InputCreateOrdersInterface) => Promise<void>
  update: (data: InputUpdateOrdersInterface) => Promise<OrderInterface>
}
