import { Logger } from '@luca_scorpion/tinylogger';
import { v4 as uuidv4 } from 'uuid';
import { PressButtonResult } from 'touchdeck-model';
import { getPreparedActions } from '../configuration/config';
import { isPreparedToggleAction } from '../actions/ToggleAction';
import WebSocketClient from '../WebSocketClient';

const log = new Logger('pressButton');

export default function pressButton(
  ws: WebSocketClient
): (buttonId: string) => Promise<PressButtonResult> {
  return async (buttonId) => {
    const actions = getPreparedActions();
    const action = actions[buttonId];

    // Check if the action exists.
    if (!action) {
      const error = `Unknown button id: ${buttonId}`;
      log.error(error);
      return {
        error,
        success: false,
        errorId: uuidv4(),
      };
    }

    // Invoke the action.
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

    // If it is a toggle action, broadcast the new state.
    if (isPreparedToggleAction(action)) {
      const newButtonState = await action.getState();
      ws.send('button-state-changed', {
        buttonId,
        buttonState: newButtonState,
      });
    }

    return { success: true };
  };
}
