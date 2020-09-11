import ActionConfig from './ActionConfig';

export type ButtonConfig =
  | NormalButtonConfig
  | ToggleButtonConfig
  | FolderButtonConfig
  | UpButtonConfig
  | FillerButtonConfig;

export interface BaseButtonConfig {
  name: string;
  type: string;
  backgroundColor?: string;
  textColor?: string;
  text?: string;
}

export interface NormalButtonConfig extends BaseButtonConfig {
  type: 'normal';
  image?: string;
  action: ActionConfig;
}

export interface ToggleButtonConfig extends BaseButtonConfig {
  type: 'toggle';
  state1: NormalButtonConfig;
  state2: NormalButtonConfig;
}

export interface FolderButtonConfig extends BaseButtonConfig {
  type: 'folder';
  buttons: ButtonConfig[];
  image?: string;
}

export interface UpButtonConfig {
  type: 'up';
}

export interface FillerButtonConfig {
  type: 'filler';
}
