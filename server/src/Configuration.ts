export interface Configuration {
  buttons: Button[];
}

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
  actionType: string;
  actionArgs: Record<string, unknown>;
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
