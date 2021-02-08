import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@luca_scorpion/tinylogger';
import { PressButtonResult } from 'touchdeck-model';
import { singleton } from '../Injector';
import WebSocketClient from '../WebSocketClient';
import { isPreparedToggleAction } from '../actions/ToggleAction';
import { ActionRegistry } from '../actions/ActionRegistry';

@singleton
export class ButtonsApi {
  private static readonly log = new Logger(ButtonsApi.name);

  public constructor(
    private readonly client: WebSocketClient,
    private readonly actionRegistry: ActionRegistry
  ) {
    this.pressButton = this.pressButton.bind(this);
  }

  public async pressButton(buttonId: string): Promise<PressButtonResult> {
    const action = this.actionRegistry.preparedActions[buttonId];

    // Check if the action exists.
    if (!action) {
      const error = `Unknown button id: ${buttonId}`;
      ButtonsApi.log.error(error);
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
      ButtonsApi.log.error(`Error invoking action ${buttonId}: ${message}`);
      return {
        success: false,
        error: `Error invoking action: ${message}`,
        errorId: uuidv4(),
      };
    }

    // If it is a toggle action, broadcast the new state.
    if (isPreparedToggleAction(action)) {
      const newButtonState = await action.getState();
      this.client.send('button-state-changed', {
        buttonId,
        buttonState: newButtonState,
      });
    }

    return { success: true };
  }

  public sendButtonStates(): void {
    ButtonsApi.log.debug('Sending all button states');
    Object.entries(this.actionRegistry.preparedActions).forEach(
      async ([buttonId, action]) => {
        if (isPreparedToggleAction(action)) {
          const buttonState = await action.getState();
          this.client.send('button-state-changed', { buttonId, buttonState });
        }
      }
    );
  }
}
