import { Logger } from '@nestjs/common';

class LoggerFake extends Logger {
    override log(message: string) { }
    override debug(message: string) { }
    override error(message: string) { }
}

export function createLogger(className: string): Logger {
    return process.env.DISABLE_LOGS === "1" ? new LoggerFake() : new Logger(className);
}
