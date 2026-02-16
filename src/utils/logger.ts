/**
 * Logging utility for the application
 * Provides structured logging with different log levels
 */

import { LogLevel } from '../types';

/**
 * Logger class for application-wide logging
 * In production, this could be extended to send logs to a remote service
 */
class Logger {
  private isDevelopment: boolean;

  constructor() {
    // Enable logging in development mode
    // In Vite, check environment using import.meta
    this.isDevelopment = typeof import.meta !== 'undefined' && 
                         (import.meta as any).env?.MODE !== 'production';
  }

  /**
   * Log an informational message
   */
  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: unknown): void {
    this.log(LogLevel.ERROR, message, error);
  }

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, data?: unknown): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, data);
    }
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;

    switch (level) {
      case LogLevel.ERROR:
        console.error(logMessage, data || '');
        break;
      case LogLevel.WARN:
        console.warn(logMessage, data || '');
        break;
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.debug(logMessage, data || '');
        }
        break;
      case LogLevel.INFO:
      default:
        console.log(logMessage, data || '');
        break;
    }
  }
}

// Export singleton instance
export const logger = new Logger();
