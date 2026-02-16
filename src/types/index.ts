/**
 * Type definitions for the countnum multiplayer scoring application
 */

/**
 * Represents a player in the game
 */
export interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
}

/**
 * Represents a game room
 */
export interface Room {
  id: string;
  maxPlayers: number;
  players: Player[];
  isPlaying: boolean;
}

/**
 * Configuration for room creation
 */
export interface RoomConfig {
  playerName: string;
  maxPlayers: number;
}

/**
 * Configuration for joining a room
 */
export interface JoinRoomConfig {
  roomId: string;
  playerName: string;
}

/**
 * Result of an operation that can fail
 */
export interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Log levels for the logger utility
 */
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}
