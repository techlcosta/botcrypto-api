
export interface OrderInterface {
  id: string
  automationId?: string | null
  symbol: string
  orderId: number
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

export interface InputFindOrderByIdInterface {
  userId: string
  id: string
}

export interface InputFindByUserIdInterface {
  userId: string
  id: string
}

export interface InputCountOrdersInterface {
  symbol?: string
  userId: string
}

export interface InputGetOrdersInterface {
  page: number
  symbol?: string
  userId: string
}

export interface InputFindOrderByOrderIdAndClientIdInterface {
  orderId: number
  clientOrderId: string
  userId: string
}

export interface InputCreateOrdersInterface {
  automationId?: string
  symbol: string
  orderId: number
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
  clientOrderId: string
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
  updatedAt?: Date
}

export interface OrdersRepositoryInterface {
  findById: (data: InputFindOrderByIdInterface) => Promise<OrderInterface | null>
  findByUserId: (data: InputFindByUserIdInterface) => Promise<OrderInterface[] | null>
  findByOrderIdAndClieantId: (data: InputFindOrderByOrderIdAndClientIdInterface) => Promise<OrderInterface | null>
  count: (data: InputCountOrdersInterface) => Promise<number>
  get: (data: InputGetOrdersInterface) => Promise<OrderInterface[]>
  create: (data: InputCreateOrdersInterface) => Promise<void>
  update: (data: InputUpdateOrdersInterface) => Promise<OrderInterface>
}
