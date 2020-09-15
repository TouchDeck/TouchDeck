export default interface TargetConfig {
  obs: ObsTargetConfig;
}

export interface ObsTargetConfig {
  ip: string;
  port: number;
  authenticated: boolean;
  password: string;
}
