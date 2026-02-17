import React, { useState, useEffect } from 'react';
import Lobby from './Lobby';
import WaitingRoom from './WaitingRoom';
import ScoreBoard from './ScoreBoard';
import { apiService, Room } from './api';

interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
}

const App: React.FC = () => {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [backendAvailable, setBackendAvailable] = useState(true);

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await apiService.healthCheck();
        setBackendAvailable(true);
      } catch (err) {
        console.error('Backend health check failed:', err);
        setBackendAvailable(false);
        setError('Backend server is not available. Please start the server.');
      }
    };
    checkBackend();
  }, []);

  // Check for saved room and player on mount
  useEffect(() => {
    const savedRoomId = localStorage.getItem('savedRoomId');
    const savedPlayerId = localStorage.getItem('savedPlayerId');

    if (savedRoomId && savedPlayerId) {
      const reconnect = async () => {
        try {
          const { room } = await apiService.getRoom(savedRoomId);
          const player = room.players.find(p => p.id === savedPlayerId);
          
          if (player) {
            setCurrentRoom(room);
            setCurrentPlayerId(savedPlayerId);
          } else {
            localStorage.removeItem('savedRoomId');
            localStorage.removeItem('savedPlayerId');
            setError('房间已解散，请重新创建或加入房间');
          }
        } catch (err: any) {
          console.error('Failed to reconnect to room:', err);
          localStorage.removeItem('savedRoomId');
          localStorage.removeItem('savedPlayerId');
          
          if (err.response?.status === 404) {
            setError('房间不存在或已解散，请重新创建或加入房间');
          } else {
            setError('连接房间失败，请检查网络连接');
          }
        }
      };
      reconnect();
    }
  }, []);

  // Poll for room updates when in a room
  useEffect(() => {
    if (!currentRoom) return;

    const roomId = currentRoom.id;
    const pollInterval = setInterval(async () => {
      try {
        const { room } = await apiService.getRoom(roomId);
        setCurrentRoom(room);
        
        // Auto-start game when all players are ready and room is full
        if (!room.isPlaying && room.players.length === room.maxPlayers && room.players.every(p => p.isReady)) {
          const { room: updatedRoom } = await apiService.startGame(roomId);
          setCurrentRoom(updatedRoom);
        }
      } catch (err: any) {
        console.error('Failed to poll room updates:', err);
        
        // If room doesn't exist, clear local state
        if (err.response?.status === 404) {
          clearInterval(pollInterval);
          setCurrentRoom(null);
          setCurrentPlayerId('');
          localStorage.removeItem('savedRoomId');
          localStorage.removeItem('savedPlayerId');
          setError('房间已解散，请重新创建或加入房间');
        }
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [currentRoom?.id]);

  const onCreateRoom = async (playerName: string, maxPlayers: number) => {
    setLoading(true);
    setError('');
    try {
      const { room, playerId } = await apiService.createRoom(playerName, maxPlayers);
      setCurrentRoom(room);
      setCurrentPlayerId(playerId);
      localStorage.setItem('savedRoomId', room.id);
      localStorage.setItem('savedPlayerId', playerId);
    } catch (err) {
      console.error('Failed to create room:', err);
      setError('Failed to create room. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const onJoinRoom = async (roomId: string, playerName: string) => {
    setLoading(true);
    setError('');
    try {
      const { room, playerId } = await apiService.joinRoom(roomId, playerName);
      setCurrentRoom(room);
      setCurrentPlayerId(playerId);
      localStorage.setItem('savedRoomId', room.id);
      localStorage.setItem('savedPlayerId', playerId);
    } catch (err: any) {
      console.error('Failed to join room:', err);
      const errorMsg = err.response?.data?.error || 'Failed to join room. Please check the room code.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const onSetReady = async (isReady: boolean) => {
    if (!currentRoom) return;
    try {
      const { room } = await apiService.setReady(currentRoom.id, currentPlayerId, isReady);
      setCurrentRoom(room);
    } catch (err) {
      console.error('Failed to set ready status:', err);
      setError('Failed to update ready status.');
    }
  };

  const onStartGame = async () => {
    if (!currentRoom) return;
    try {
      const { room } = await apiService.startGame(currentRoom.id);
      setCurrentRoom(room);
    } catch (err: any) {
      console.error('Failed to start game:', err);
      const errorMsg = err.response?.data?.error || 'Failed to start game.';
      setError(errorMsg);
    }
  };

  const onUpdateScore = async (playerId: string, points: number) => {
    if (!currentRoom) return;
    try {
      const { room } = await apiService.updateScore(currentRoom.id, playerId, points, currentPlayerId);
      setCurrentRoom(room);
    } catch (err) {
      console.error('Failed to update score:', err);
      setError('Failed to update score.');
    }
  };

  const onUndoScore = async () => {
    if (!currentRoom) return;
    try {
      const { room } = await apiService.undoScore(currentRoom.id);
      setCurrentRoom(room);
    } catch (err: any) {
      console.error('Failed to undo score:', err);
      const errorMsg = err.response?.data?.error || 'Failed to undo score.';
      setError(errorMsg);
    }
  };

  const onLeaveRoom = async () => {
    if (!currentRoom) return;
    try {
      await apiService.leaveRoom(currentRoom.id, currentPlayerId);
      setCurrentRoom(null);
      setCurrentPlayerId('');
      localStorage.removeItem('savedRoomId');
      localStorage.removeItem('savedPlayerId');
    } catch (err) {
      console.error('Failed to leave room:', err);
      setCurrentRoom(null);
      setCurrentPlayerId('');
      localStorage.removeItem('savedRoomId');
      localStorage.removeItem('savedPlayerId');
    }
  };

  if (!currentRoom) {
    return (
      <>
        {error && (
          <div style={{ 
            position: 'fixed', 
            top: '20px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            background: 'linear-gradient(to right, #ef4444, #dc2626)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
            zIndex: 1000
          }}>
            ⚠️ {error}
          </div>
        )}
        <Lobby
          onCreateRoom={onCreateRoom}
          onJoinRoom={onJoinRoom}
          loading={loading}
        />
      </>
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
      />
    );
  }

  return (
    <ScoreBoard
      room={currentRoom}
      currentPlayerId={currentPlayerId}
      onUpdateScore={onUpdateScore}
      onUndoScore={onUndoScore}
      onLeaveRoom={onLeaveRoom}
    />
  );
};

export default App;