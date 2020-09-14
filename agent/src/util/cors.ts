import { NextFunction, Request, Response } from 'express';

export default function cors(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
}
