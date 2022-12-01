import { Router } from 'express'
import { AuthMiddleware } from '../middlewares/authMiddleware'
import { GetOrdersController } from '../modules/orders/controllers/getOrders-controller'
import { NewOrderController } from './../modules/orders/controllers/newOrder-controller'

export const ordersRoutes = Router()

ordersRoutes.get('/:symbol?', AuthMiddleware, new GetOrdersController().handle)

ordersRoutes.post('/', AuthMiddleware, new NewOrderController().handle)
