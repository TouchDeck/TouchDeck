import { AgentMeta } from '../AgentInfo';
import { ButtonConfig } from '../configuration/ButtonConfig';
import Configuration, { ButtonLayout } from '../configuration/Configuration';
import { ActionOption } from '../ActionOption';
import ButtonStateChanged from './ButtonStateChanged';
import { PressButtonResult } from './PressButtonResult';
import { ImageInfo } from './ImageInfo';
import { Path } from './Path';

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
  'get-images': void;
  'upload-image': ImageInfo;
  'delete-image': Path;
}

export interface MessageResponseMap {
  'get-info': AgentMeta;
  'get-configuration': Configuration;
  'set-configuration': Configuration;
  'upsert-configuration-button': Configuration;
  'delete-configuration-button': Configuration;
  'set-layout': Configuration;
  'get-action-options': ActionOption[];
  'press-button': PressButtonResult;
  'button-state-changed': void;
  'get-images': ImageInfo[];
  'upload-image': void;
  'delete-image': void;
}
