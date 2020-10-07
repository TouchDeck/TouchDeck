import { Logger } from '@luca_scorpion/tinylogger';
import { v4 as uuidv4 } from 'uuid';
import { getPreparedActions } from '../configuration/config';
import { ApiResponse } from '../model/ApiResponse';

const log = new Logger('pressButton');

export default async function pressButton(
  buttonId: string
): Promise<ApiResponse> {
  const actions = getPreparedActions();
  const action = actions[buttonId];

  if (!action) {
    const error = `Unknown button id: ${buttonId}`;
    log.error(error);
    return {
      error,
      success: false,
      errorId: uuidv4(),
    };
  }

  try {
    await action.invoke();
  } catch (error) {
    const message = error.message || error.description || error.error;
    log.error(`Error invoking action ${buttonId}: ${message}`);
    return {
      success: false,
      error: `Error invoking action: ${message}`,
      errorId: uuidv4(),
    };
  }

  return {
    success: true,
    // TODO
    // buttonStates: {}
  };
}
