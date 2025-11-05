import pino from 'pino';

/**
 * Logger utility using Pino for structured logging
 *
 * Note: pino-pretty and transport are NOT used as they require worker threads
 * which don't work in Next.js server actions.
 *
 * Logs are output as JSON which can be parsed by log aggregation services.
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  browser: {
    asObject: true,
  },
  // No transport - direct logging without worker threads
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
});

/**
 * Create a child logger with additional context
 *
 * @example
 * const log = createLogger({ module: 'auth', userId: '123' });
 * log.info('User logged in');
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}

/**
 * Log an error with full context
 *
 * @example
 * logError(error, { action: 'createDesk', deskId: '123' });
 */
export function logError(error: unknown, context?: Record<string, unknown>) {
  const errorInfo = {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  };

  logger.error(errorInfo);
}

/**
 * Log info with context
 */
export function logInfo(message: string, context?: Record<string, unknown>) {
  logger.info({ ...context, message });
}

/**
 * Log debug with context (only in development)
 */
export function logDebug(message: string, context?: Record<string, unknown>) {
  logger.debug({ ...context, message });
}

/**
 * Log warning with context
 */
export function logWarn(message: string, context?: Record<string, unknown>) {
  logger.warn({ ...context, message });
}
