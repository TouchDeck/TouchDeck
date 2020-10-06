import { Request, Response } from 'express';
import { Logger } from '@luca_scorpion/tinylogger';
import { v4 as uuidv4 } from 'uuid';
import { getPreparedActions } from '../configuration/config';
import { InvokeActionResponse } from '../model/InvokeActionResponse';

const log = new Logger('invokeAction');

export default function invokeAction(
  req: Request,
  res: Response<InvokeActionResponse>
): void {
  const actions = getPreparedActions();
  const actionId = req.params.action;
  const action = actions[actionId];

  if (!action) {
    const error = `Unknown action id: ${actionId}`;
    log.error(error);
    res.status(404).send({
      error,
      success: false,
      errorId: uuidv4(),
    });
    return;
  }

  Promise.resolve(action.invoke())
    .then(() =>
      res.send({
        success: true,
        // TODO
        buttonStates: {},
      })
    )
    .catch((error) => {
      const message = error.message || error.description || error.error;
      log.error(`Error invoking action ${actionId}: ${message}`);
      res.status(500).send({
        success: false,
        error: `Error invoking action: ${message}`,
        errorId: uuidv4(),
      });
    });
}
