export default interface ActionConfig {
  type: string;
  args: ActionArgs;
}

export type ActionArgs = Record<string, ActionArgument>;

export type ActionArgument = string | boolean | number;
