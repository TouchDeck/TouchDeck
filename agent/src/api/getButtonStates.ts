import { Request, Response } from 'express';
import { Logger } from '@luca_scorpion/tinylogger';
import { ButtonStates } from '../model/ButtonStates';
import { getPreparedActions } from '../configuration/config';
import { isPreparedToggleAction } from '../actions/ToggleAction';

const log = new Logger('getButtonStates');

export default function getButtonStates(
  req: Request,
  res: Response<ButtonStates>
): void {
  const actions = getPreparedActions();
  const states: ButtonStates = {};

  const getStatePromises = Object.entries(actions).map(([actionId, action]) => {
    if (isPreparedToggleAction(action)) {
      return Promise.resolve(action.getState())
        .then((state) => {
          states[actionId] = state;
        })
        .catch((error) => {
          const message = error.message || error.description || error.error;
          log.warn(`Could not get action state: ${message}`);
          states[actionId] = false;
        });
    }
  });

  Promise.all(getStatePromises).then(() => res.send(states));
}
