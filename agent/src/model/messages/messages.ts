import AgentInfo from '../AgentInfo';
import { ButtonConfig } from '../configuration/ButtonConfig';
import Configuration, { ButtonLayout } from '../configuration/Configuration';
import ActionOption from '../ActionOption';
import { ApiResponse } from '../ApiResponse';
import { ButtonStateChanged } from './ButtonStateChanged';

export interface MessageDataMap {
  'get-info': void;
  'get-configuration': void;
  'set-configuration': Configuration;
  'upsert-configuration-button': ButtonConfig;
  'delete-configuration-button': string;
  'set-layout': ButtonLayout;
  'get-action-options': void;
  'press-button': string;
  'button-state-changed': ButtonStateChanged;
}

export interface MessageResponseMap {
  'get-info': AgentInfo;
  'get-configuration': Configuration;
  'set-configuration': Configuration;
  'upsert-configuration-button': Configuration;
  'delete-configuration-button': Configuration;
  'set-layout': Configuration;
  'get-action-options': ActionOption[];
  'press-button': ApiResponse;
  'button-state-changed': void;
}
