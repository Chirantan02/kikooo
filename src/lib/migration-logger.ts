export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

export class MigrationLogger {
  private logs: LogEntry[] = [];
  private minLevel: LogLevel;

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    if (level < this.minLevel) return;

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      error
    };

    this.logs.push(entry);
    this.outputToConsole(entry);
  }

  private outputToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const prefix = `[${timestamp}] ${levelName}:`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.context || '');
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.context || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.context || '');
        break;
      case LogLevel.ERROR:
        console.error(prefix, entry.message, entry.error || '', entry.context || '');
        break;
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return this.logs.map(log => {
      const timestamp = log.timestamp.toISOString();
      const levelName = LogLevel[log.level];
      let output = `[${timestamp}] ${levelName}: ${log.message}`;
      
      if (log.context) {
        output += ` | Context: ${JSON.stringify(log.context)}`;
      }
      
      if (log.error) {
        output += ` | Error: ${log.error.message}`;
        if (log.error.stack) {
          output += `\nStack: ${log.error.stack}`;
        }
      }
      
      return output;
    }).join('\n');
  }
}