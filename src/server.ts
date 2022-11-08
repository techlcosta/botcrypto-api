import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import { MiddlewareError } from './middlewares/middlewareError';
import { router } from './routes/routes';

dotenv.config();

const app = express();

app.use(cors());

app.use(helmet());

app.use(express.json());

app.use('/api', router);

app.listen(process.env.PORT, () => {
  console.log(`server is running! ${process.env.PORT}`);
});

app.use((err: Error, request: Request, response: Response) => {
  if (err instanceof MiddlewareError) {
    return response.status(err.statusCode).json({ message: err.message, code: err.code });
  }

  return response.status(500).json({ message: `Internal server error - ${err.message}` });
});
