
export enum LogLevel {
  All = 0,
  Debug = 1,
  Information = 2,
  Warning = 3,
  Error = 4,
  Critical = 5,
  None = 6,
}

export interface ILogger {
  log(logLevel: LogLevel, message: string): void;
  clear(): void;
}
// TODO
class LoggerService implements ILogger {
  public static instance: LoggerService;
  public logSinks: any[];
  constructor() {
    if (!LoggerService.instance) {
      LoggerService.instance = this;
    }

    return LoggerService.instance;
  }

  public log(logLevel: LogLevel, message: string): void {
    this.logSinks.forEach(sink => {
      sink.log(logLevel, message);
    });
  }

  public clear() : void {
    this.logSinks.forEach(sink => {
      sink.clear();
    });
  }
}

const logger = new LoggerService();
export default logger;