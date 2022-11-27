import { Router } from 'express'
import { AuthMiddleware } from '../middlewares/authMiddleware'
import { GetBalanceController } from './../modules/exchange/controllers/getBalance-controller'

export const exchangeRoutes = Router()

exchangeRoutes.get('/balance', AuthMiddleware, new GetBalanceController().handle)
