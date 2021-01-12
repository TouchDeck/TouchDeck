import { Logger } from '@luca_scorpion/tinylogger';
import { getPreparedActions } from '../configuration/config';
import { isPreparedToggleAction } from '../actions/ToggleAction';
import WebSocketClient from '../WebSocketClient';

const log = new Logger('sendButtonStates');

export default function sendButtonStates(client: WebSocketClient): void {
  log.debug('Sending all button states');
  Object.entries(getPreparedActions()).forEach(async ([buttonId, action]) => {
    if (isPreparedToggleAction(action)) {
      const buttonState = await action.getState();
      client.send('button-state-changed', { buttonId, buttonState });
    }
  });
}
