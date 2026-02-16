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
    // Check if we're running in Vite development environment
    // In production builds, logs will be minimized
    this.isDevelopment = true; // Default to development mode for safety
    try {
      // Try to access Vite's environment if available
      if (typeof import.meta !== 'undefined' && 'env' in import.meta) {
        const env = (import.meta as { env?: { MODE?: string } }).env;
        this.isDevelopment = env?.MODE !== 'production';
      }
    } catch {
      // If import.meta is not available (e.g., in tests), default to development
      this.isDevelopment = true;
    }
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
