import React, { useState } from 'react';

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

interface ScoreBoardProps {
  room: Room;
  currentPlayerId: string;
  onUpdateScore: (playerId: string, points: number) => void;
  onLeaveRoom: () => void;
  error?: string;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ room, currentPlayerId, onUpdateScore, onLeaveRoom, error }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [points, setPoints] = useState<number>(1);

  const currentPlayer = room.players.find(p => p.id === currentPlayerId);

  const handleAddScore = () => {
    if (selectedPlayer) {
      onUpdateScore(selectedPlayer, points);
    }
  };

  const handleSubtractScore = () => {
    if (selectedPlayer) {
      onUpdateScore(selectedPlayer, -points);
    }
  };

  // 按分数排序玩家
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-center mb-6">计分游戏 - 分数板</h2>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">房间码 / Room Code</p>
              <p className="text-2xl font-bold text-blue-600">{room.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">玩家人数 / Players</p>
              <p className="text-2xl font-bold">{room.players.length}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">玩家分数 / Player Scores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`p-4 rounded-lg border-2 ${player.id === currentPlayerId ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-200'}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500', 'bg-teal-500', 'bg-lime-500'][index % 10]}`}>
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{player.name}</p>
                      {player.id === currentPlayerId && (
                        <p className="text-xs bg-blue-500 text-white inline-block px-2 py-1 rounded">你</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-800">{player.score}</p>
                    <p className="text-sm text-gray-500">分数</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">更新分数 / Update Score</h3>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择玩家 / Select Player
              </label>
              <select
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">请选择玩家</option>
                {room.players.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分数 / Points
              </label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(Math.max(1, Number(e.target.value) || 1))}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleAddScore}
                disabled={!selectedPlayer}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                + 增加分数
              </button>
              <button
                onClick={handleSubtractScore}
                disabled={!selectedPlayer}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                - 减少分数
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onLeaveRoom}
          className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
        >
          离开房间
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>点击玩家旁边的按钮来更新分数</p>
          <p>Click buttons to update scores</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;