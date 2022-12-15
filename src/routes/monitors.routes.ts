import { Router } from 'express'
import { AuthMiddleware } from '../middlewares/authMiddleware'
import { GetMonitorsController } from './../modules/monitors/controllers/getMonitors-controller'

export const monitorsRoutes = Router()

monitorsRoutes.get('/:symbol?', AuthMiddleware, new GetMonitorsController().handle)
