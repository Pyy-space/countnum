import React, { useState } from 'react';

interface LobbyProps {
  onCreateRoom: (playerName: string, maxPlayers: number) => void;
  onJoinRoom: (roomId: string, playerName: string) => void;
  loading: boolean;
}

const Lobby: React.FC<LobbyProps> = ({ onCreateRoom, onJoinRoom, loading }) => {
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [playerName, setPlayerName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [roomCode, setRoomCode] = useState('');

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onCreateRoom(playerName.trim(), maxPlayers);
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim() && roomCode.trim()) {
      onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 cute-pattern flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 star-pattern"></div>
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full border border-purple-500/30 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          🎮 计分游戏 ✨
        </h1>
        <p className="text-center text-purple-300 mb-8">🌟 在线多人计分系统 🌟</p>

        {mode === 'menu' && (
          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-purple-500/30"
            >
              🏠 创建房间
            </button>
            <button
              onClick={() => setMode('join')}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-purple-500/30"
            >
              🚀 加入房间
            </button>
            <p className="text-center text-xs text-purple-400 mt-4">
              👥 支持2-10人同时在线计分 💫
            </p>
          </div>
        )}

        {mode === 'create' && (
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                👤 玩家名称
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-slate-700/50 text-white placeholder-purple-400"
                placeholder="输入你的名字"
                maxLength={20}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                👥 最大玩家数
              </label>
              <select
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                className="w-full px-4 py-3 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-slate-700/50 text-white"
              >
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num} 人</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode('menu')}
                className="flex-1 bg-slate-700 text-purple-300 py-3 rounded-xl hover:bg-slate-600 transition-all duration-300 font-semibold"
              >
                ↩️ 返回
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-purple-500/30 font-semibold"
              >
                {loading ? '⏳ 创建中...' : '✨ 创建'}
              </button>
            </div>
          </form>
        )}

        {mode === 'join' && (
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                👤 玩家名称
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-slate-700/50 text-white placeholder-purple-400"
                placeholder="输入你的名字"
                maxLength={20}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                🔑 房间码
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 uppercase bg-slate-700/50 text-white placeholder-purple-400"
                placeholder="输入房间码"
                maxLength={6}
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode('menu')}
                className="flex-1 bg-slate-700 text-purple-300 py-3 rounded-xl hover:bg-slate-600 transition-all duration-300 font-semibold"
              >
                ↩️ 返回
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-purple-500/30 font-semibold"
              >
                {loading ? '⏳ 加入中...' : '🚀 加入'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Lobby;
