import ActionConfig from './ActionConfig';

export type ButtonConfig = ActionButtonConfig | FolderButtonConfig;

export type ActionButtonConfig = NormalButtonConfig | ToggleButtonConfig;

export type ButtonType = 'normal' | 'toggle' | 'folder';

export interface BaseButtonConfig {
  id: string;
  name: string;
  type: ButtonType;
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
  action: ActionConfig;
  trueStyle: ButtonStyling;
  falseStyle: ButtonStyling;
}

export interface FolderButtonConfig extends StyledButtonConfig {
  type: 'folder';
}
