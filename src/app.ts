import cors from 'cors'
import dotenv from 'dotenv'
import express, { json } from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import morgan from 'morgan'
import { ErrorMiddlewate } from './middlewares/errorMiddleware'
import { router } from './routes/routes'

dotenv.config()

export const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN }))

app.use(helmet())

app.use(json())

app.use(morgan('dev'))

app.use('/api', router)

app.use(ErrorMiddlewate)
