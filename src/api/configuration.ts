export type Buttons = ButtonConfig[];

export type ButtonConfig =
  FillerButtonConfig
  | FolderUpButtonConfig
  | NormalButtonConfig
  | ToggleButtonConfig
  | FolderButtonConfig;

export interface BaseButtonConfig {
  type: string;
  backgroundColor?: string;
  textColor?: string;
  text?: string;
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
}

export interface ToggleButtonConfig extends BaseButtonConfig {
  type: 'toggle';
  state1: NormalButtonConfig;
  state2: NormalButtonConfig;
}

export interface FolderButtonConfig extends BaseButtonConfig {
  type: 'folder';
  buttons: ButtonConfig[];
}

export function getButtonConfiguration(): ButtonConfig[] {
  return ([
    {
      type: 'normal',
      text: 'button button button',
      uuid: '1',
      backgroundColor: '#FF0000',
      textColor: 'white'
    },
    {
      type: 'normal',
      text: '🔥🔥🔥',
      uuid: '2',
      backgroundColor: '#00FF00'
    },
    {
      type: 'toggle',
      state1: {
        type: 'normal',
        text: '🔇',
        uuid: 'mute',
        backgroundColor: '#0000FF',
        textColor: 'white'
      },
      state2: {
        type: 'normal',
        text: '🔊',
        uuid: 'unmute',
        backgroundColor: '#0000FF',
        textColor: 'white'
      }
    },
    {
      type: 'folder',
      text: 'folder 1',
      buttons: [
        {
          type: 'normal',
          text: 'in folder',
          uuid: 'ffff',
          backgroundColor: '#FF0000',
          textColor: 'white'
        }
      ]
    },
    {
      type: 'folder',
      text: 'folder 2',
      buttons: []
    },
    {
      type: 'folder',
      text: 'folder 3',
      buttons: []
    }
  ]);
}
