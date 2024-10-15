const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    // Write all logs with level `error` and below to error.log
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'), 
      level: 'error' 
    }),
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/combined.log') 
    })
  ]
});

// Add a method to get the line number where the log was called
logger.getLine = () => {
  try {
    const err = new Error();
    const stack = err.stack.split('\n');
    // Find the first line that's not part of this file
    const callerLine = stack.find(line => !line.includes('logger.js'));
    if (callerLine) {
      const match = callerLine.match(/:(\d+):\d+\)?$/);
      if (match) {
        return match[1];
      }
    }
    return 'unknown';
  } catch (error) {
    return 'error getting line';
  }
};

module.exports = logger;