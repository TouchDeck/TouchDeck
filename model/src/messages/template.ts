export interface Template {
  text: string;
  values: Record<string, unknown>;
}

export interface TemplateInfo extends Template {
  path: string;
}

export interface UpsertTemplate {
  path: string | null;
  template: TemplateInfo;
}
