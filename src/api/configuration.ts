export interface ButtonConfig {
  backgroundColor?: string;
  textColor?: string;
  text?: string;
  uuid?: string;
  disabled?: boolean;
}

export function getButtonConfiguration(): ButtonConfig[] {
  return ([
    {
      text: 'button button button',
      uuid: '1',
      backgroundColor: '#FF0000',
      textColor: 'white'
    },
    {
      text: '🔥🔥🔥',
      uuid: '2',
      backgroundColor: '#00FF00'
    },
    {
      text: '🔇',
      uuid: '3',
      backgroundColor: '#0000FF',
      textColor: 'white'
    },
    {
      text: 'folder 1'
    },
    {
      text: 'folder 2'
    },
    {
      text: 'folder 3'
    }
  ]);
}
