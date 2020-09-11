export type Button = NormalButton | ToggleButton | FolderButton;

export interface BaseButton {
  type: string;
  backgroundColor?: string;
  textColor?: string;
  text?: string;
  description?: string;
}

export interface NormalButton extends BaseButton {
  type: 'normal';
  image?: string;
  action: ActionConfig;
}

export interface ToggleButton extends BaseButton {
  type: 'toggle';
  state1: NormalButton;
  state2: NormalButton;
}

export interface FolderButton extends BaseButton {
  type: 'folder';
  buttons: Button[];
  image?: string;
}

export interface ActionConfig {
  id: string;
  type: string;
  args: Record<string, unknown>;
}
