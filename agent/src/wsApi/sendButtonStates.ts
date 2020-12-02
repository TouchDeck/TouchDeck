import { Logger } from '@luca_scorpion/tinylogger';
import { getPreparedActions } from '../configuration/config';
import { isPreparedToggleAction } from '../actions/ToggleAction';
import WebSocketServer from '../WebSocketServer';

const log = new Logger('sendButtonStates');

export default function sendButtonStates(server: WebSocketServer): void {
  log.debug('Sending all button states');
  Object.entries(getPreparedActions()).forEach(async ([buttonId, action]) => {
    if (isPreparedToggleAction(action)) {
      const buttonState = await action.getState();
      server.broadcast('button-state-changed', { buttonId, buttonState });
    }
  });
}
