import { Injectable, Logger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LogUtilService extends Logger {
  constructor(private logger: Logger) {
    super();
  }

  setContext(context: string) {
    this.logger = new Logger(context);
  }

  log(message: string, args?: any | any[]) {
    if (args && args.password) {
      delete args.password;
    }

    this.logger.log({ message, ...args });
  }
}
