/* eslint-disable @typescript-eslint/no-unused-vars */
import cors from 'cors'
import dotenv from 'dotenv'
import express, { json } from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import { ErrorMiddlewate } from './middlewares/errorMiddleware'
import { router } from './routes/routes'

dotenv.config()

const app = express()

app.use(cors())

app.use(helmet())

app.use(json())

app.use('/api', router)

app.use(ErrorMiddlewate)

app.listen(process.env.PORT, () => {
  console.log(`server is running! ${process.env.PORT as string}`)
})
