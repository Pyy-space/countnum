import React from 'react';

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

interface WaitingRoomProps {
  room: Room;
  currentPlayerId: string;
  onSetReady: (isReady: boolean) => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ room, currentPlayerId, onSetReady, onStartGame, onLeaveRoom }) => {
  const currentPlayer = room.players.find(p => p.id === currentPlayerId);
  const isReady = currentPlayer?.isReady || false;
  const allReady = room.players.length >= 2 && room.players.every(p => p.isReady);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 cute-pattern flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 star-pattern"></div>
      <div className="bg-slate-900/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-violet-500/40 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"><span className="text-5xl">🎮</span> 计分游戏 - 等待室 <span className="text-5xl">✨</span></h2>
        
        <div className="mb-6 p-4 bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50 rounded-xl border border-violet-500/40">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-purple-300">🔑 房间码</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{room.id}</p>
            </div>
            <div>
              <p className="text-sm text-purple-300">👥 玩家人数</p>
              <p className="text-2xl font-bold text-white">{room.players.length} / {room.maxPlayers}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-purple-300">🎯 玩家列表</h3>
          <div className="space-y-2">
            {room.players.map((player, index) => (
              <div
                key={player.id}
                className={`p-4 rounded-xl flex justify-between items-center transition-all duration-300 ${
                  player.id === currentPlayerId 
                    ? 'bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50 border-2 border-violet-400' 
                    : 'bg-slate-800/50 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                    ['bg-gradient-to-br from-red-500 to-pink-500', 'bg-gradient-to-br from-blue-500 to-cyan-500', 'bg-gradient-to-br from-green-500 to-emerald-500', 'bg-gradient-to-br from-yellow-500 to-orange-500', 'bg-gradient-to-br from-purple-500 to-violet-500', 'bg-gradient-to-br from-pink-500 to-rose-500', 'bg-gradient-to-br from-indigo-500 to-blue-500'][index % 7]
                  }`}>
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-white">{player.name}</span>
                  {player.id === currentPlayerId && (
                    <span className="text-xs bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-2 py-1 rounded-full shadow-md">👤 你</span>
                  )}
                </div>
                <div>
                  {player.isReady ? (
                    <span className="text-green-400 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      ✅ 准备就绪
                    </span>
                  ) : (
                    <span className="text-purple-400">⏳ 等待中</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {room.players.length < room.maxPlayers && (
            <div className="p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-xl text-center">
              <p className="text-yellow-400 font-medium">⏳ 等待玩家加入 ({room.players.length}/{room.maxPlayers})</p>
            </div>
          )}

          <button
            onClick={() => onSetReady(!isReady)}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
              isReady
                ? 'bg-slate-800 text-purple-300 hover:bg-slate-700'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/40'
            }`}
          >
            {isReady ? '❌ 取消准备' : '✅ 准备'}
          </button>

          <button
            onClick={onLeaveRoom}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-red-500/40"
          >
              🚪 离开房间
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-purple-400">
          <p>📢 分享房间码给朋友加入游戏哦 🎉</p>
          <p className="mt-1">⚡ 所有玩家准备好后游戏将自动开始</p>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
