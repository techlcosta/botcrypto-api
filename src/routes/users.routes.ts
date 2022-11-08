import { Router } from 'express';
import { AuthController } from '../modules/users/controllers/auth-controller';

export const usersRoutes = Router();

usersRoutes.post('/authenticate', new AuthController().handle);
