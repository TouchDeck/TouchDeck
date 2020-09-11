function envOrDefault(param: string, def: string): string {
  const env = process.env[param];
  return env === undefined ? def : env;
}

export const PORT = parseInt(envOrDefault('PORT', '5000'), 10);

export const KEEP_AGENT_TIME = parseInt(
  envOrDefault('KEEP_AGENT_TIME', '600'),
  10
);
