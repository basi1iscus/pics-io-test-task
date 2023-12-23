import { ILogger } from '../../interfaces';

class LoggerFactory {
  constructor(public logger: ILogger) {}

  getLogger() {
    return this.logger;
  }
}

export default new LoggerFactory(console).getLogger();
