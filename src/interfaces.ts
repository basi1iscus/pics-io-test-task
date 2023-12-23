export type Class = new (...args: any[]) => any;

export interface ILogger {
  info(...args: any): void;
  error(...args: any): void;
  warn(...args: any): void;
}
