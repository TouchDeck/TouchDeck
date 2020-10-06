export default interface ActionOption {
  type: string;
  category: string;
  name: string;
  parameters: ActionParameter[];
  toggleable: boolean;
}

export interface ActionParameter {
  name: string;
  type: 'string' | 'boolean' | 'number';
}
