import { Logger } from '@luca_scorpion/tinylogger';
import { singleton } from './Injector';
import WebSocketClient from './WebSocketClient';
import { ConfigApi } from './wsApi/ConfigApi';
import { getAgentMeta } from './util/getAgentMeta';
import { Configuration } from '../../model';
import sendButtonStates from './wsApi/sendButtonStates';
import { ConfigManager } from './ConfigManager';
import pressButton from './wsApi/pressButton';
import {
  deleteImage,
  getImages,
  renameImage,
  uploadImage,
} from './wsApi/images';
import { ActionsApi } from './wsApi/ActionsApi';

@singleton
export class Agent {
  private static readonly log = new Logger(Agent.name);

  public constructor(
    private readonly client: WebSocketClient,
    configManager: ConfigManager,
    configApi: ConfigApi,
    actionsApi: ActionsApi
  ) {
    Agent.log.debug('Registering client handlers');

    client.registerHandler('get-info', getAgentMeta);
    client.registerHandler(
      'get-configuration',
      (): Configuration => {
        // When a get-configuration message is received, this means a new client is connected.
        // So we broadcast all the current button states.
        sendButtonStates(client);
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
    client.registerHandler('press-button', pressButton(client));

    client.registerHandler('get-images', getImages);
    client.registerHandler('upload-image', uploadImage);
    client.registerHandler('delete-image', deleteImage);
    client.registerHandler('rename-image', renameImage);
  }
}
