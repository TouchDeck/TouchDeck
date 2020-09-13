type LogLevel = 'DEBUG' | 'INFO ' | 'WARN ' | 'ERROR';

export default class Logger {
  private static maxNameLength = 0;

  public constructor(private readonly name: string) {
    Logger.maxNameLength = Math.max(Logger.maxNameLength, name.length);
  }

  private static padName(name: string): string {
    return `${name}${' '.repeat(Logger.maxNameLength - name.length)}`;
  }

  public info(message: unknown): void {
    this.log('INFO ', message);
  }

  public debug(message: unknown): void {
    this.log('DEBUG', message);
  }

  public warn(message: unknown): void {
    this.log('WARN ', message);
  }

  public error(message: unknown): void {
    this.log('ERROR', message);
  }

  private log(level: LogLevel, message: unknown): void {
    // eslint-disable-next-line no-console
    console.log(
      `${new Date().toISOString()} [${level}] ${Logger.padName(this.name)} |`,
      message
    );
  }
}
