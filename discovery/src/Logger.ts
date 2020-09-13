enum LogLevel {
  DEBUG = 1,
  INFO,
  WARN,
  ERROR,
  OFF,
}

const minLogLevel =
  LogLevel[process.env.LOG_LEVEL as keyof typeof LogLevel] || LogLevel.INFO;

const logLevelNames = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO ',
  [LogLevel.WARN]: 'WARN ',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.OFF]: '',
};

export default class Logger {
  private static maxNameLength = 0;

  public constructor(private readonly name: string) {
    Logger.maxNameLength = Math.max(Logger.maxNameLength, name.length);
  }

  private static padName(name: string): string {
    return `${name}${' '.repeat(Logger.maxNameLength - name.length)}`;
  }

  public debug(message: unknown): void {
    this.log(LogLevel.DEBUG, message);
  }

  public info(message: unknown): void {
    this.log(LogLevel.INFO, message);
  }

  public warn(message: unknown): void {
    this.log(LogLevel.WARN, message);
  }

  public error(message: unknown): void {
    this.log(LogLevel.ERROR, message);
  }

  private log(level: LogLevel, message: unknown): void {
    if (level >= minLogLevel) {
      // eslint-disable-next-line no-console
      console.log(
        `${new Date().toISOString()} [${logLevelNames[level]}] ${Logger.padName(
          this.name
        )} |`,
        message
      );
    }
  }
}
