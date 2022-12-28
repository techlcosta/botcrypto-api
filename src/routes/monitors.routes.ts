import { Router } from 'express'
import { AuthMiddleware } from '../middlewares/authMiddleware'
import { NewMonitorController } from '../modules/monitors/controllers/newMonitor-controller'
import { RemoveMonitorController } from '../modules/monitors/controllers/removeMonitor-controller'
import { UpdateMonitorController } from '../modules/monitors/controllers/updateMonitors-controller'
import { GetMonitorsController } from './../modules/monitors/controllers/getMonitors-controller'
import { StartMonitorController } from './../modules/monitors/controllers/startMonitor-controller'
import { StopMonitorController } from './../modules/monitors/controllers/stopMonitor-controller'

export const monitorsRoutes = Router()

monitorsRoutes.get('/:symbol?', AuthMiddleware, new GetMonitorsController().handle)

monitorsRoutes.post('/new', AuthMiddleware, new NewMonitorController().handle)

monitorsRoutes.patch('/update', AuthMiddleware, new UpdateMonitorController().handle)

monitorsRoutes.delete('/remove/:id', AuthMiddleware, new RemoveMonitorController().handle)

monitorsRoutes.post('/:id/start', AuthMiddleware, new StartMonitorController().handle)

monitorsRoutes.post('/:id/stop', AuthMiddleware, new StopMonitorController().handle)
