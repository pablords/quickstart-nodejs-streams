import winston from "winston"

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    // transports: [
    //     new winston.transports.File({ filename: 'logs/warn.log', level: 'warn' })
    // ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}