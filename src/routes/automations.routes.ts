import { Router } from 'express'
import { AuthMiddleware } from '../middlewares/authMiddleware'
import { GetAutomationsController } from './../modules/automations/controllers/getAutomations-controller'

export const automationsRoutes = Router()

automationsRoutes.get('/:symbol?', AuthMiddleware, new GetAutomationsController().handle)
