import { Router } from 'express'
import { AuthMiddleware } from '../middlewares/authMiddleware'
import { GetOrdersController } from '../modules/orders/controllers/getOrders-controller'

export const ordersRoutes = Router()

ordersRoutes.get('/:symbol?', AuthMiddleware, new GetOrdersController().handle)
