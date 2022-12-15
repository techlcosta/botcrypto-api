import { app } from './app'
import { ExchangeMonitorController } from './modules/exchange/controllers/exchangeMonitor-controller'

const server = app.listen(process.env.PORT, () => {
  console.log(`server is running! ${process.env.PORT as string}`)
})

const exchangeMonitor = new ExchangeMonitorController()

exchangeMonitor.handle({ server }).catch(err => console.error(err))
