import { getPreparedActions } from '../configuration/config';
import { isPreparedToggleAction } from '../actions/ToggleAction';
import WebSocketServer from '../WebSocketServer';

export default function sendButtonStates(server: WebSocketServer): void {
  Object.entries(getPreparedActions()).forEach(async ([buttonId, action]) => {
    if (isPreparedToggleAction(action)) {
      const buttonState = await action.getState();
      server.send('button-state-changed', { buttonId, buttonState });
    }
  });
}
