import ActionConfig from './ActionConfig';

export type ButtonConfig =
  | NormalButtonConfig
  | ToggleButtonConfig
  | FolderButtonConfig
  | UpButtonConfig;

export interface BaseButtonConfig {
  name: string;
  type: string;
}

export interface ButtonStyling {
  backgroundColor: string;
  textColor: string;
  text: string;
  image: string;
}

export interface NormalButtonConfig extends BaseButtonConfig {
  type: 'normal';
  action: ActionConfig;
  style: ButtonStyling;
}

export interface ToggleButtonConfig extends BaseButtonConfig {
  type: 'toggle';
  state1: ToggleButtonState;
  state2: ToggleButtonState;
}

export interface ToggleButtonState {
  action: ActionConfig;
  style: ButtonStyling;
}

export interface FolderButtonConfig extends BaseButtonConfig {
  type: 'folder';
  buttons: ButtonConfig[];
  style: ButtonStyling;
}

export interface UpButtonConfig {
  type: 'up';
}
