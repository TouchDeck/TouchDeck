export default interface ActionConfig {
  id: string;
  type: string;
  args: ActionArgs;
}

export type ActionArgs = Record<string, ActionArgument>

export type ActionArgument = string | boolean;
