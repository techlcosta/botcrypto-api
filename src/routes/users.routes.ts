import { Router } from 'express'
import { AuthMiddleware } from '../middlewares/authMiddleware'
import { AuthController } from '../modules/users/controllers/authUser-controller'
import { GetUserController } from './../modules/users/controllers/getUser-controller'
import { UpdateUserController } from './../modules/users/controllers/updateUser-controller'

export const usersRoutes = Router()

usersRoutes.post('/authenticate', new AuthController().handle)

usersRoutes.get('/infos', AuthMiddleware, new GetUserController().handle)

usersRoutes.patch('/update', AuthMiddleware, new UpdateUserController().handle)
