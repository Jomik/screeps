import { ErrorMapper } from "../utils/ErrorMapper";

export const enum LogLevel {
  Debug,
  Info,
  Alert,
  Warn,
  Error,
  Fatal
}

const styles = {
  [LogLevel.Debug]: "color: darkblue",
  [LogLevel.Info]: "color: darkgreen",
  [LogLevel.Alert]: "color: cyan",
  [LogLevel.Warn]: "color: white",
  [LogLevel.Error]: "color: red",
  [LogLevel.Fatal]: "color: yellow; background-color: red"
}

type Message = string | (() => string);
type ErrorType = Error | (() => Error);

export class Logger {
  constructor(private readonly name: string) { }

  private log(level: LogLevel, message: Message, error?: ErrorType) {
    const log = (typeof message === "function" ? message() : message);
    const err = error === undefined ? "" :
      "\nError: " + ErrorMapper.sourceMappedStackTrace(typeof error === "function" ? error() : error);
    console.log(`<log severity="${level}" style="${styles[level]}">[${level}][${this.name}] ${log}${err}</log>`);
  }

  public debug(message: Message, error?: ErrorType) {
    this.log(LogLevel.Debug, message, error);
  }
  public info(message: Message, error?: ErrorType) {
    this.log(LogLevel.Info, message, error);
  }
  public alert(message: Message, error?: ErrorType) {
    this.log(LogLevel.Alert, message, error);
  }
  public warn(message: Message, error?: ErrorType) {
    this.log(LogLevel.Warn, message, error);
  }
  public error(message: Message, error?: ErrorType) {
    this.log(LogLevel.Error, message, error);
  }
  public fatal(message: Message, error?: ErrorType) {
    this.log(LogLevel.Fatal, message, error);
  }
}
