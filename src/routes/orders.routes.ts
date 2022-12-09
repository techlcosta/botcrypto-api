import { Router } from 'express'
import { AuthMiddleware } from '../middlewares/authMiddleware'
import { GetOrdersController } from '../modules/orders/controllers/getOrders-controller'
import { CancelOrderController } from './../modules/orders/controllers/cancelOrder-controller'
import { NewOrderController } from './../modules/orders/controllers/newOrder-controller'

export const ordersRoutes = Router()

ordersRoutes.get('/:symbol?', AuthMiddleware, new GetOrdersController().handle)

ordersRoutes.post('/new', AuthMiddleware, new NewOrderController().handle)

ordersRoutes.patch('/cancel', AuthMiddleware, new CancelOrderController().handle)
