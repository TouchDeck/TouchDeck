export default interface ActionConfig {
  id: string;
  type: string;
  args: Record<string, unknown>;
}
