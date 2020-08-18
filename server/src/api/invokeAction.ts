import { Request, Response } from 'express';

export default function invokeAction(req: Request, res: Response): void {
  res.send({ ok: true });
}
