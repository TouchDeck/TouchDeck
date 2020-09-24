import ActionConfig from './ActionConfig';

export type ButtonConfig =
  | NormalButtonConfig
  | ToggleButtonConfig
  | FolderButtonConfig
  | UpButtonConfig;

export interface BaseButtonConfig {
  id: string;
  name: string;
  type: string;
}

export interface StyledButtonConfig extends BaseButtonConfig {
  style: ButtonStyling;
}

export interface ButtonStyling {
  backgroundColor: string;
  textColor: string;
  text: string;
  image: string;
}

export interface NormalButtonConfig extends StyledButtonConfig {
  type: 'normal';
  action: ActionConfig;
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

export interface FolderButtonConfig extends StyledButtonConfig {
  type: 'folder';
}

export interface UpButtonConfig {
  type: 'up';
}
