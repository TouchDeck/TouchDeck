export default interface ActionOption {
  id: string;
  category: string;
  name: string;
  parameters: ActionParameter[];
}

export interface ActionParameter {
  name: string;
  type: 'string' | 'number';
}
