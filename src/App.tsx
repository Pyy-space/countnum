import React, { useState } from 'react';
import Lobby from './Lobby';
import WaitingRoom from './WaitingRoom';
import ScoreBoard from './ScoreBoard';

interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
}

interface Room {
  id: string;
  maxPlayers: number;
  players: Player[];
  isPlaying: boolean;
}

const App: React.FC = () => {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateRoomCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const onCreateRoom = (playerName: string, maxPlayers: number) => {
    setLoading(true);
    setTimeout(() => {
      const roomId = generateRoomCode();
      const playerId = `player_${Date.now()}`;
      const newRoom: Room = {
        id: roomId,
        maxPlayers,
        players: [{
          id: playerId,
          name: playerName,
          score: 0,
          isReady: false
        }],
        isPlaying: false
      };
      setCurrentRoom(newRoom);
      setCurrentPlayerId(playerId);
      setLoading(false);
    }, 500);
  };

  const onJoinRoom = (roomId: string, playerName: string) => {
    setLoading(true);
    setTimeout(() => {
      // 模拟加入房间
      const playerId = `player_${Date.now()}`;
      const mockRoom: Room = {
        id: roomId,
        maxPlayers: 10,
        players: [{
          id: playerId,
          name: playerName,
          score: 0,
          isReady: false
        }, {
          id: 'player_1',
          name: 'Player 1',
          score: 0,
          isReady: false
        }],
        isPlaying: false
      };
      setCurrentRoom(mockRoom);
      setCurrentPlayerId(playerId);
      setLoading(false);
    }, 500);
  };

  const onSetReady = (isReady: boolean) => {
    if (!currentRoom) return;
    const updatedPlayers = currentRoom.players.map(player => 
      player.id === currentPlayerId ? { ...player, isReady } : player
    );
    setCurrentRoom({ ...currentRoom, players: updatedPlayers });
  };

  const onStartGame = () => {
    if (!currentRoom) return;
    setCurrentRoom({ ...currentRoom, isPlaying: true });
  };

  const onUpdateScore = (playerId: string, points: number) => {
    if (!currentRoom) return;
    const updatedPlayers = currentRoom.players.map(player => 
      player.id === playerId ? { ...player, score: player.score + points } : player
    );
    setCurrentRoom({ ...currentRoom, players: updatedPlayers });
  };

  const onLeaveRoom = () => {
    setCurrentRoom(null);
    setCurrentPlayerId('');
  };

  if (!currentRoom) {
    return (
      <Lobby
        onCreateRoom={onCreateRoom}
        onJoinRoom={onJoinRoom}
        loading={loading}
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
      />
    );
  }

  return (
    <ScoreBoard
      room={currentRoom}
      currentPlayerId={currentPlayerId}
      onUpdateScore={onUpdateScore}
      onLeaveRoom={onLeaveRoom}
    />
  );
};

export default App;