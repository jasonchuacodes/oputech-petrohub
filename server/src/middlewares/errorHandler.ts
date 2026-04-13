import { NextFunction, Request, Response } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(statusCode).json({
    name: err.name,
    message,
    ...(err.fieldErrors !== undefined && { fieldErrors: err.fieldErrors }),
  });
};
