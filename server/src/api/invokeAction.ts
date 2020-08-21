import { Request, Response } from 'express';
import { getActionsByUuid } from '../configuration/config';

export default function invokeAction(req: Request, res: Response): void {
  const actions = getActionsByUuid();
  const action = actions[req.params.action];

  if (!action) {
    throw new Error(`Unknown action uuid: ${action}`);
  }

  res.send({ ok: true, action });
}
