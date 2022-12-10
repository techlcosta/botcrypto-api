
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

export interface InputFindByIdInterface {
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

export interface InputFindByOrderIdAndClieantIdInterface {
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
  findById: ({ id, userId }: InputFindByIdInterface) => Promise<OrderInterface | null>
  findByUserId: ({ userId }: InputFindByUserIdInterface) => Promise<OrderInterface[] | null>
  findByOrderIdAndClieantId: ({ orderId, clientOrderId }: InputFindByOrderIdAndClieantIdInterface) => Promise<OrderInterface | null>
  count: ({ symbol, userId }: InputCountOrdersInterface) => Promise<number>
  get: (data: InputGetOrdersInterface) => Promise<OrderInterface[]>
  create: (data: InputCreateOrdersInterface) => Promise<void>
  update: (data: InputUpdateOrdersInterface) => Promise<OrderInterface>
}
