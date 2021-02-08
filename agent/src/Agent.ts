import { Logger } from '@luca_scorpion/tinylogger';
import { singleton } from './Injector';
import WebSocketClient from './WebSocketClient';
import { ConfigApi } from './wsApi/ConfigApi';
import { getAgentMeta } from './util/getAgentMeta';
import { Configuration } from '../../model';
import { ConfigManager } from './ConfigManager';
import { ActionsApi } from './wsApi/ActionsApi';
import { ImagesApi } from './wsApi/ImagesApi';
import { ButtonsApi } from './wsApi/ButtonsApi';

@singleton
export class Agent {
  private static readonly log = new Logger(Agent.name);

  public constructor(
    client: WebSocketClient,
    configManager: ConfigManager,
    configApi: ConfigApi,
    actionsApi: ActionsApi,
    buttonsApi: ButtonsApi,
    imagesApi: ImagesApi
  ) {
    Agent.log.debug('Registering client handlers');

    client.registerHandler('get-info', getAgentMeta);
    client.registerHandler(
      'get-configuration',
      (): Configuration => {
        // When a get-configuration message is received, this means a new client is connected.
        // So we broadcast all the current button states.
        buttonsApi.sendButtonStates();
        return configManager.config;
      }
    );

    client.registerHandler('set-configuration', configApi.updateConfig);
    client.registerHandler(
      'upsert-configuration-button',
      configApi.upsertButton
    );
    client.registerHandler(
      'delete-configuration-button',
      configApi.deleteButton
    );
    client.registerHandler('set-layout', configApi.updateLayout);

    client.registerHandler('get-action-options', actionsApi.getActionOptions);
    client.registerHandler('press-button', buttonsApi.pressButton);

    client.registerHandler('get-images', imagesApi.getImages);
    client.registerHandler('upload-image', imagesApi.uploadImage);
    client.registerHandler('delete-image', imagesApi.deleteImage);
    client.registerHandler('rename-image', imagesApi.renameImage);
  }
}
