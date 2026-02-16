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
}

type ScoreMode = 'personal' | 'mutual';

const ScoreBoard: React.FC<ScoreBoardProps> = ({ room, currentPlayerId, onUpdateScore, onLeaveRoom }) => {
  const [scoreMode, setScoreMode] = useState<ScoreMode>('personal');
  const [points, setPoints] = useState<number>(1);
  const [mutualPlayer1, setMutualPlayer1] = useState<string>('');
  const [mutualPlayer2, setMutualPlayer2] = useState<string>('');

  const currentPlayer = room.players.find(p => p.id === currentPlayerId);

  const handlePersonalAddScore = () => {
    onUpdateScore(currentPlayerId, points);
  };

  const handlePersonalSubtractScore = () => {
    onUpdateScore(currentPlayerId, -points);
  };

  const handleMutualScore = () => {
    if (mutualPlayer1 && mutualPlayer2 && mutualPlayer1 !== mutualPlayer2) {
      onUpdateScore(mutualPlayer1, points);
      onUpdateScore(mutualPlayer2, points);
    }
  };

  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-center mb-6">计分游戏 - 分数板</h2>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">房间码</p>
              <p className="text-2xl font-bold text-blue-600">{room.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">玩家人数</p>
              <p className="text-2xl font-bold">{room.players.length}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">玩家分数</h3>
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
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setScoreMode('personal')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                scoreMode === 'personal' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              给自己加减分
            </button>
            <button
              onClick={() => setScoreMode('mutual')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                scoreMode === 'mutual' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              互相加分
            </button>
          </div>

          <h3 className="text-lg font-semibold mb-4">
            {scoreMode === 'personal' ? '给自己加减分' : '互相加分'}
          </h3>

          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            {scoreMode === 'personal' ? (
              <>
                <div className="p-4 bg-blue-50 rounded-lg mb-4">
                  <p className="font-medium text-blue-800">当前玩家</p>
                  <p className="text-xl font-bold text-blue-600">{currentPlayer?.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分数
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
                    onClick={handlePersonalAddScore}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    + 给自己加分
                  </button>
                  <button
                    onClick={handlePersonalSubtractScore}
                    className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    - 给自己减分
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      玩家 A
                    </label>
                    <select
                      value={mutualPlayer1}
                      onChange={(e) => setMutualPlayer1(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">选择玩家 A</option>
                      {room.players.map(player => (
                        <option key={player.id} value={player.id}>
                          {player.name} {player.id === currentPlayerId ? '(你)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      玩家 B
                    </label>
                    <select
                      value={mutualPlayer2}
                      onChange={(e) => setMutualPlayer2(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">选择玩家 B</option>
                      {room.players.map(player => (
                        <option key={player.id} value={player.id}>
                          {player.name} {player.id === currentPlayerId ? '(你)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分数
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
                    onClick={handleMutualScore}
                    disabled={!mutualPlayer1 || !mutualPlayer2 || mutualPlayer1 === mutualPlayer2}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                  >
                    给两个玩家都加分
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <button
          onClick={onLeaveRoom}
          className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
        >
          离开房间
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>给自己加减分：只能给自己加分或减分</p>
          <p>互相加分：选择两个玩家，都加分</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;