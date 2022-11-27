import { Router } from 'express'
import { AuthMiddleware } from '../middlewares/authMiddleware'
import { GetSymbolsController } from '../modules/symbols/controllers/getSymbols-controller'
import { SyncSymbolsController } from '../modules/symbols/controllers/syncSymbols-controller'
import { UpdateSymbolController } from '../modules/symbols/controllers/updateSymbol-controller'

export const symbolsRoutes = Router()

symbolsRoutes.get('/', AuthMiddleware, new GetSymbolsController().handle)

symbolsRoutes.post('/sync', AuthMiddleware, new SyncSymbolsController().handle)

symbolsRoutes.patch('/update', AuthMiddleware, new UpdateSymbolController().handle)
