/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { AppError } from '../helpers/errors/appError';

export async function ErrorMiddlewate(err: Error, request: Request, response: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({ message: err.message, code: err.code });
  }

  return response.status(500).json({ message: `Internal server error - ${err.message}` });
}
