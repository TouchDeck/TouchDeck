export type ActionOption = NormalActionOption | ToggleActionOption;

export interface BaseActionOption {
  type: string;
  category: string;
  name: string;
  parameters: ActionParameter[];
  toggleable: boolean;
}

export interface NormalActionOption extends BaseActionOption {
  toggleable: false;
}

export interface ToggleActionOption extends BaseActionOption {
  toggleable: true;
  toggleInfo: ToggleActionInfo;
}

export interface ToggleActionInfo {
  trueStateName: string;
  falseStateName: string;
}

export interface ActionParameter {
  name: string;
  type: 'string' | 'boolean' | 'number';
}
