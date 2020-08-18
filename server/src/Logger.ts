type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export default class Logger {
  public constructor(private readonly name: string) {}

  private static padRight(level: LogLevel): string {
    if (level.length === 4) {
      return `${level} `;
    }
    return level;
  }

  public info(message: unknown): void {
    this.log('INFO', message);
  }

  public debug(message: unknown): void {
    this.log('DEBUG', message);
  }

  public warn(message: unknown): void {
    this.log('WARN', message);
  }

  public error(message: unknown): void {
    this.log('ERROR', message);
  }

  private log(level: LogLevel, message: unknown): void {
    // eslint-disable-next-line no-console
    console.log(`[${Logger.padRight(level)}] ${this.name}:`, message);
  }
}
