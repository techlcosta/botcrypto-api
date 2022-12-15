import { Router } from 'express'
import { exchangeRoutes } from './exchange.routes'
import { monitorsRoutes } from './monitors.routes'
import { ordersRoutes } from './orders.routes'
import { symbolsRoutes } from './symbols.routes'
import { usersRoutes } from './users.routes'

export const router = Router()

router.use('/user', usersRoutes)

router.use('/symbols', symbolsRoutes)

router.use('/exchange', exchangeRoutes)

router.use('/orders', ordersRoutes)

router.use('/monitors', monitorsRoutes)
