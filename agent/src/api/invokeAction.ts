import { Request, Response } from 'express';
import { Logger } from '@luca_scorpion/tinylogger';
import { getActionsById } from '../configuration/config';

const log = new Logger('invokeAction');

export default function invokeAction(req: Request, res: Response): void {
  const actions = getActionsById();
  const actionId = req.params.action;
  const action = actions[actionId];

  if (!action) {
    const error = `Unknown action id: ${actionId}`;
    log.error(error);
    res.status(404).send({
      error,
      success: false,
    });
    return;
  }

  Promise.resolve(action())
    .then(() =>
      res.send({
        success: true,
      })
    )
    .catch((error) => {
      const message = error.message || error.description;
      log.error(`Error invoking action ${actionId}: ${message}`);
      res.status(500).send({
        success: false,
        error: message,
      });
    });
}
