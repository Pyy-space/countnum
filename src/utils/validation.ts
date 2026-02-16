/**
 * Validation utilities for input validation
 */

import { logger } from './logger';

/**
 * Validate player name
 * @param name - Player name to validate
 * @returns true if valid, false otherwise
 */
export function validatePlayerName(name: string): boolean {
  const trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    logger.warn('Validation failed: Player name is empty');
    return false;
  }
  
  if (trimmedName.length > 20) {
    logger.warn('Validation failed: Player name exceeds 20 characters', { length: trimmedName.length });
    return false;
  }
  
  return true;
}

/**
 * Validate room code format
 * @param code - Room code to validate
 * @returns true if valid, false otherwise
 */
export function validateRoomCode(code: string): boolean {
  const trimmedCode = code.trim();
  
  if (trimmedCode.length !== 6) {
    logger.warn('Validation failed: Room code must be exactly 6 characters', { length: trimmedCode.length });
    return false;
  }
  
  // Room code should only contain alphanumeric characters
  const alphanumericRegex = /^[A-Z0-9]+$/;
  if (!alphanumericRegex.test(trimmedCode)) {
    logger.warn('Validation failed: Room code contains invalid characters');
    return false;
  }
  
  return true;
}

/**
 * Validate max players count
 * @param count - Number of max players
 * @returns true if valid, false otherwise
 */
export function validateMaxPlayers(count: number): boolean {
  if (count < 2) {
    logger.warn('Validation failed: Max players must be at least 2', { count });
    return false;
  }
  
  if (count > 10) {
    logger.warn('Validation failed: Max players cannot exceed 10', { count });
    return false;
  }
  
  return true;
}

/**
 * Validate score points
 * @param points - Points to add/subtract
 * @returns true if valid, false otherwise
 */
export function validateScorePoints(points: number): boolean {
  if (isNaN(points)) {
    logger.warn('Validation failed: Score points is not a number');
    return false;
  }
  
  // Allow negative points for subtraction
  return true;
}

/**
 * Validate player ID exists in room
 * @param playerId - Player ID to check
 * @param playerIds - List of valid player IDs
 * @returns true if valid, false otherwise
 */
export function validatePlayerId(playerId: string, playerIds: string[]): boolean {
  if (!playerIds.includes(playerId)) {
    logger.warn('Validation failed: Player ID not found in room', { playerId });
    return false;
  }
  
  return true;
}
