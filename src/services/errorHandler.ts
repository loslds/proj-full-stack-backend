
import { NextFunction, Request, Response } from "express";
import { HttpException } from "./HttpException";

export const errorHandler = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Erro interno do servidor'
  
  console.error(`[ERROR] ${statusCode} ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    status: statusCode,
  });
};

