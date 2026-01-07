
// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/HttpException";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpException) {
    console.error(`[HTTP ${err.status}] ${err.message}`);

    return res.status(err.status).json({
      success: false,
      message: err.message,
      status: err.status,
    });
  }

  console.error('[UNEXPECTED ERROR]', err);

  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    status: 500,
  });
};
