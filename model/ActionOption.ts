export default interface ActionOption {
  type: string;
  category: string;
  name: string;
  parameters: ActionParameter[];
}

export interface ActionParameter {
  name: string;
  type: 'string' | 'boolean';
}
