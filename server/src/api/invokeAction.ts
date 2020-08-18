import { Request, Response } from 'express';
import { getActionsByUuid } from '../Configuration';

export default function invokeAction(req: Request, res: Response): void {
  const actions = getActionsByUuid();
  const action = actions[req.body.action];

  if (!action) {
    throw new Error(`Unknown action uuid: ${action}`);
  }

  res.send({ ok: true, action });
}
