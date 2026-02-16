import React, { useState } from 'react';
import Lobby from './Lobby';
import WaitingRoom from './WaitingRoom';
import ScoreBoard from './ScoreBoard';
import { Room } from './types';
import { createRoom, joinRoom } from './services/roomService';
import { 
  updatePlayerReadyStatus, 
  startGame, 
  updatePlayerScore 
} from './services/gameService';
import { logger } from './utils/logger';

const App: React.FC = () => {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  /**
   * Handle room creation
   * Creates a new game room with the specified configuration
   * @param playerName - Name of the player creating the room
   * @param maxPlayers - Maximum number of players allowed
   */
  const onCreateRoom = (playerName: string, maxPlayers: number) => {
    logger.info('onCreateRoom called', { playerName, maxPlayers });
    setLoading(true);
    setError('');
    
    // Simulate network delay for better UX
    setTimeout(() => {
      const result = createRoom({ playerName, maxPlayers });
      
      if (result.success && result.data) {
        setCurrentRoom(result.data.room);
        setCurrentPlayerId(result.data.playerId);
        logger.info('Room created and state updated', { 
          roomId: result.data.room.id,
          playerId: result.data.playerId 
        });
      } else {
        setError(result.error || 'Failed to create room');
        logger.error('Room creation failed', { error: result.error });
      }
      
      setLoading(false);
    }, 500);
  };

  /**
   * Handle joining an existing room
   * Allows a player to join an existing game room
   * @param roomId - ID of the room to join
   * @param playerName - Name of the player joining
   */
  const onJoinRoom = (roomId: string, playerName: string) => {
    logger.info('onJoinRoom called', { roomId, playerName });
    setLoading(true);
    setError('');
    
    // Simulate network delay for better UX
    setTimeout(() => {
      const result = joinRoom({ roomId, playerName });
      
      if (result.success && result.data) {
        setCurrentRoom(result.data.room);
        setCurrentPlayerId(result.data.playerId);
        logger.info('Joined room and state updated', { 
          roomId: result.data.room.id,
          playerId: result.data.playerId 
        });
      } else {
        setError(result.error || 'Failed to join room');
        logger.error('Room joining failed', { error: result.error });
      }
      
      setLoading(false);
    }, 500);
  };

  /**
   * Handle updating player's ready status
   * Toggles the ready state for the current player
   * @param isReady - Whether the player is ready
   */
  const onSetReady = (isReady: boolean) => {
    if (!currentRoom) {
      logger.warn('Cannot set ready: no current room');
      return;
    }
    
    logger.info('onSetReady called', { isReady, playerId: currentPlayerId });
    
    const result = updatePlayerReadyStatus(currentRoom, currentPlayerId, isReady);
    
    if (result.success && result.data) {
      setCurrentRoom(result.data);
      logger.info('Ready status updated successfully');
    } else {
      setError(result.error || 'Failed to update ready status');
      logger.error('Failed to update ready status', { error: result.error });
    }
  };

  /**
   * Handle starting the game
   * Transitions from waiting room to active game
   */
  const onStartGame = () => {
    if (!currentRoom) {
      logger.warn('Cannot start game: no current room');
      return;
    }
    
    logger.info('onStartGame called', { roomId: currentRoom.id });
    
    const result = startGame(currentRoom);
    
    if (result.success && result.data) {
      setCurrentRoom(result.data);
      logger.info('Game started successfully');
    } else {
      setError(result.error || 'Failed to start game');
      logger.error('Failed to start game', { error: result.error });
    }
  };

  /**
   * Handle updating a player's score
   * Adds or subtracts points from a player's score
   * @param playerId - ID of the player whose score to update
   * @param points - Points to add (positive) or subtract (negative)
   */
  const onUpdateScore = (playerId: string, points: number) => {
    if (!currentRoom) {
      logger.warn('Cannot update score: no current room');
      return;
    }
    
    logger.info('onUpdateScore called', { playerId, points });
    
    const result = updatePlayerScore(currentRoom, playerId, points);
    
    if (result.success && result.data) {
      setCurrentRoom(result.data);
      logger.info('Score updated successfully');
    } else {
      setError(result.error || 'Failed to update score');
      logger.error('Failed to update score', { error: result.error });
    }
  };

  /**
   * Handle leaving the current room
   * Clears the current room and player state, returning to lobby
   */
  const onLeaveRoom = () => {
    logger.info('onLeaveRoom called', { 
      roomId: currentRoom?.id, 
      playerId: currentPlayerId 
    });
    
    // Clear room and player state
    setCurrentRoom(null);
    setCurrentPlayerId('');
    setError('');
    
    logger.info('Left room successfully, returned to lobby');
  };

  // Render appropriate screen based on current state
  if (!currentRoom) {
    return (
      <Lobby
        onCreateRoom={onCreateRoom}
        onJoinRoom={onJoinRoom}
        loading={loading}
        error={error}
      />
    );
  }

  if (!currentRoom.isPlaying) {
    return (
      <WaitingRoom
        room={currentRoom}
        currentPlayerId={currentPlayerId}
        onSetReady={onSetReady}
        onStartGame={onStartGame}
        onLeaveRoom={onLeaveRoom}
        error={error}
      />
    );
  }

  return (
    <ScoreBoard
      room={currentRoom}
      currentPlayerId={currentPlayerId}
      onUpdateScore={onUpdateScore}
      onLeaveRoom={onLeaveRoom}
      error={error}
    />
  );
};

export default App;