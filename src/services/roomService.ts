/**
 * Room service for managing game rooms
 * Handles room creation, joining, and validation logic
 */

import { Room, Player, RoomConfig, JoinRoomConfig, OperationResult } from '../types';
import { logger } from '../utils/logger';
import { 
  validatePlayerName, 
  validateRoomCode, 
  validateMaxPlayers 
} from '../utils/validation';

/**
 * Generate a unique room code
 * @returns 6-character alphanumeric room code
 */
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars.charAt(randomIndex);
  }
  
  logger.debug('Generated room code', { code });
  return code;
}

/**
 * Generate a unique player ID
 * @returns Unique player identifier
 */
export function generatePlayerId(): string {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);
  const playerId = `player_${timestamp}_${randomSuffix}`;
  
  logger.debug('Generated player ID', { playerId });
  return playerId;
}

/**
 * Create a new player object
 * @param name - Player name
 * @returns Player object
 */
export function createPlayer(name: string): Player {
  if (!validatePlayerName(name)) {
    throw new Error('Invalid player name');
  }
  
  const player: Player = {
    id: generatePlayerId(),
    name: name.trim(),
    score: 0,
    isReady: false,
  };
  
  logger.info('Created new player', { playerId: player.id, name: player.name });
  return player;
}

/**
 * Create a new room
 * @param config - Room configuration
 * @returns Operation result with room data or error
 */
export function createRoom(config: RoomConfig): OperationResult<{ room: Room; playerId: string }> {
  try {
    logger.info('Creating new room', config);
    
    // Validate inputs
    if (!validatePlayerName(config.playerName)) {
      return {
        success: false,
        error: 'Invalid player name. Please enter a valid name (1-20 characters).',
      };
    }
    
    if (!validateMaxPlayers(config.maxPlayers)) {
      return {
        success: false,
        error: 'Invalid max players. Must be between 2 and 10.',
      };
    }
    
    // Create room and player
    const roomId = generateRoomCode();
    const player = createPlayer(config.playerName);
    
    const room: Room = {
      id: roomId,
      maxPlayers: config.maxPlayers,
      players: [player],
      isPlaying: false,
    };
    
    logger.info('Room created successfully', { 
      roomId: room.id, 
      playerId: player.id,
      maxPlayers: config.maxPlayers 
    });
    
    return {
      success: true,
      data: { room, playerId: player.id },
    };
  } catch (error) {
    logger.error('Error creating room', error);
    return {
      success: false,
      error: 'Failed to create room. Please try again.',
    };
  }
}

/**
 * Join an existing room
 * Note: This is a mock implementation. In a real application, this would
 * communicate with a backend server to join the actual room.
 * 
 * @param config - Join room configuration
 * @returns Operation result with room data or error
 */
export function joinRoom(config: JoinRoomConfig): OperationResult<{ room: Room; playerId: string }> {
  try {
    logger.info('Joining room', { roomId: config.roomId, playerName: config.playerName });
    
    // Validate inputs
    if (!validatePlayerName(config.playerName)) {
      return {
        success: false,
        error: 'Invalid player name. Please enter a valid name (1-20 characters).',
      };
    }
    
    if (!validateRoomCode(config.roomId)) {
      return {
        success: false,
        error: 'Invalid room code. Room code must be exactly 6 alphanumeric characters.',
      };
    }
    
    // Create new player
    const player = createPlayer(config.playerName);
    
    // Mock room data - In a real application, this would fetch from server
    // For now, we create a mock room with the joining player and one existing player
    const mockRoom: Room = {
      id: config.roomId.toUpperCase(),
      maxPlayers: 10,
      players: [
        player,
        {
          id: 'player_mock_1',
          name: 'Player 1',
          score: 0,
          isReady: false,
        },
      ],
      isPlaying: false,
    };
    
    logger.info('Successfully joined room', { 
      roomId: mockRoom.id, 
      playerId: player.id,
      totalPlayers: mockRoom.players.length 
    });
    
    return {
      success: true,
      data: { room: mockRoom, playerId: player.id },
    };
  } catch (error) {
    logger.error('Error joining room', error);
    return {
      success: false,
      error: 'Failed to join room. Please check the room code and try again.',
    };
  }
}

/**
 * Check if room is full
 * @param room - Room to check
 * @returns true if room is full
 */
export function isRoomFull(room: Room): boolean {
  const isFull = room.players.length >= room.maxPlayers;
  
  if (isFull) {
    logger.warn('Room is full', { 
      roomId: room.id, 
      currentPlayers: room.players.length, 
      maxPlayers: room.maxPlayers 
    });
  }
  
  return isFull;
}

/**
 * Check if minimum players are present to start game
 * @param room - Room to check
 * @returns true if enough players
 */
export function hasMinimumPlayers(room: Room): boolean {
  const hasMinimum = room.players.length >= 2;
  
  if (!hasMinimum) {
    logger.warn('Not enough players to start game', { 
      roomId: room.id, 
      currentPlayers: room.players.length 
    });
  }
  
  return hasMinimum;
}
