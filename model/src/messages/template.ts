export interface TemplateInfo {
  path: string;
  text: string;
  values: Record<string, unknown>;
}

export interface UpsertTemplate {
  path: string | null;
  template: TemplateInfo;
}
