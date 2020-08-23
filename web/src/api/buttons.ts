export type Buttons = ButtonConfig[];

export type ButtonConfig =
  | FillerButtonConfig
  | FolderUpButtonConfig
  | NormalButtonConfig
  | ToggleButtonConfig
  | FolderButtonConfig;

export interface BaseButtonConfig {
  type: string;
  backgroundColor?: string;
  textColor?: string;
  text?: string;
  description?: string;
}

export interface FillerButtonConfig extends BaseButtonConfig {
  type: 'filler';
}

export interface FolderUpButtonConfig extends BaseButtonConfig {
  type: 'up';
}

export interface NormalButtonConfig extends BaseButtonConfig {
  type: 'normal';
  uuid: string;
  image?: string;
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
