/**
 * Game service for managing game state and operations
 * Handles ready states, game start, score updates, and player management
 */

import { Room, Player, OperationResult } from '../types';
import { logger } from '../utils/logger';
import { validatePlayerId, validateScorePoints } from '../utils/validation';

/**
 * Update player's ready status
 * @param room - Current room
 * @param playerId - Player ID to update
 * @param isReady - Ready status
 * @returns Updated room or error
 */
export function updatePlayerReadyStatus(
  room: Room,
  playerId: string,
  isReady: boolean
): OperationResult<Room> {
  try {
    logger.info('Updating player ready status', { playerId, isReady });
    
    // Validate player exists in room
    const playerIds = room.players.map(p => p.id);
    if (!validatePlayerId(playerId, playerIds)) {
      return {
        success: false,
        error: 'Player not found in room.',
      };
    }
    
    // Update player's ready status
    const updatedPlayers = room.players.map(player =>
      player.id === playerId ? { ...player, isReady } : player
    );
    
    const updatedRoom: Room = {
      ...room,
      players: updatedPlayers,
    };
    
    logger.info('Player ready status updated', { 
      playerId, 
      isReady,
      readyCount: updatedPlayers.filter(p => p.isReady).length,
      totalPlayers: updatedPlayers.length
    });
    
    return {
      success: true,
      data: updatedRoom,
    };
  } catch (error) {
    logger.error('Error updating player ready status', error);
    return {
      success: false,
      error: 'Failed to update ready status.',
    };
  }
}

/**
 * Check if all players are ready
 * @param room - Room to check
 * @returns true if all players are ready
 */
export function areAllPlayersReady(room: Room): boolean {
  if (room.players.length < 2) {
    logger.debug('Not all players ready: insufficient players', { 
      currentPlayers: room.players.length 
    });
    return false;
  }
  
  const allReady = room.players.every(player => player.isReady);
  
  logger.debug('Checked if all players ready', { 
    allReady,
    readyCount: room.players.filter(p => p.isReady).length,
    totalPlayers: room.players.length
  });
  
  return allReady;
}

/**
 * Start the game
 * @param room - Current room
 * @returns Updated room with game started or error
 */
export function startGame(room: Room): OperationResult<Room> {
  try {
    logger.info('Starting game', { roomId: room.id });
    
    // Validate minimum players
    if (room.players.length < 2) {
      logger.warn('Cannot start game: insufficient players', { 
        currentPlayers: room.players.length 
      });
      return {
        success: false,
        error: 'Need at least 2 players to start the game.',
      };
    }
    
    // Validate all players are ready
    if (!areAllPlayersReady(room)) {
      logger.warn('Cannot start game: not all players are ready');
      return {
        success: false,
        error: 'All players must be ready to start the game.',
      };
    }
    
    // Check if game is already playing
    if (room.isPlaying) {
      logger.warn('Game is already in progress', { roomId: room.id });
      return {
        success: false,
        error: 'Game is already in progress.',
      };
    }
    
    const updatedRoom: Room = {
      ...room,
      isPlaying: true,
    };
    
    logger.info('Game started successfully', { 
      roomId: room.id,
      playerCount: room.players.length 
    });
    
    return {
      success: true,
      data: updatedRoom,
    };
  } catch (error) {
    logger.error('Error starting game', error);
    return {
      success: false,
      error: 'Failed to start game.',
    };
  }
}

/**
 * Update player's score
 * @param room - Current room
 * @param playerId - Player ID whose score to update
 * @param points - Points to add (can be negative to subtract)
 * @returns Updated room or error
 */
export function updatePlayerScore(
  room: Room,
  playerId: string,
  points: number
): OperationResult<Room> {
  try {
    logger.info('Updating player score', { playerId, points });
    
    // Validate inputs
    if (!validateScorePoints(points)) {
      return {
        success: false,
        error: 'Invalid score points.',
      };
    }
    
    const playerIds = room.players.map(p => p.id);
    if (!validatePlayerId(playerId, playerIds)) {
      return {
        success: false,
        error: 'Player not found in room.',
      };
    }
    
    // Update player's score
    const updatedPlayers = room.players.map(player => {
      if (player.id === playerId) {
        const newScore = player.score + points;
        
        logger.debug('Score calculation', {
          playerId,
          oldScore: player.score,
          points,
          newScore
        });
        
        return { ...player, score: newScore };
      }
      return player;
    });
    
    const updatedRoom: Room = {
      ...room,
      players: updatedPlayers,
    };
    
    const updatedPlayer = updatedPlayers.find(p => p.id === playerId);
    logger.info('Player score updated', { 
      playerId, 
      points,
      newScore: updatedPlayer?.score 
    });
    
    return {
      success: true,
      data: updatedRoom,
    };
  } catch (error) {
    logger.error('Error updating player score', error);
    return {
      success: false,
      error: 'Failed to update score.',
    };
  }
}

/**
 * Remove a player from the room
 * @param room - Current room
 * @param playerId - Player ID to remove
 * @returns Updated room or null if room should be closed
 */
export function removePlayerFromRoom(
  room: Room,
  playerId: string
): OperationResult<Room | null> {
  try {
    logger.info('Removing player from room', { playerId, roomId: room.id });
    
    const playerIds = room.players.map(p => p.id);
    if (!validatePlayerId(playerId, playerIds)) {
      return {
        success: false,
        error: 'Player not found in room.',
      };
    }
    
    // Remove the player
    const updatedPlayers = room.players.filter(player => player.id !== playerId);
    
    // If no players left, room should be closed
    if (updatedPlayers.length === 0) {
      logger.info('All players left, room closed', { roomId: room.id });
      return {
        success: true,
        data: null,
      };
    }
    
    const updatedRoom: Room = {
      ...room,
      players: updatedPlayers,
    };
    
    logger.info('Player removed from room', { 
      playerId,
      remainingPlayers: updatedPlayers.length 
    });
    
    return {
      success: true,
      data: updatedRoom,
    };
  } catch (error) {
    logger.error('Error removing player from room', error);
    return {
      success: false,
      error: 'Failed to remove player from room.',
    };
  }
}

/**
 * Reset all players' ready status
 * Useful when returning to waiting room or resetting game state
 * @param room - Current room
 * @returns Updated room with all players not ready
 */
export function resetPlayersReadyStatus(room: Room): Room {
  logger.info('Resetting all players ready status', { roomId: room.id });
  
  const updatedPlayers = room.players.map(player => ({
    ...player,
    isReady: false,
  }));
  
  return {
    ...room,
    players: updatedPlayers,
  };
}
