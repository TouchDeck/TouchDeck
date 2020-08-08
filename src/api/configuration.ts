export interface ButtonConfig {
  color?: string;
  text?: string;
  uuid?: string;
  disabled?: boolean;
}

export function getButtonConfiguration(): ButtonConfig[] {
  return ([
    {
      text: 'button 1',
      uuid: '1',
      color: '#FF0000'
    },
    {
      text: 'button 2',
      uuid: '2',
      color: '#00FF00'
    },
    {
      text: 'button 3',
      uuid: '3',
      color: '#0000FF'
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
