import React, { useState } from 'react';

interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
}

interface ActionLog {
  id: string;
  timestamp: number;
  actorId: string;
  actorName: string;
  action: 'add' | 'deduct' | 'transfer';
  targetId?: string;
  targetName?: string;
  amount: number;
  recipientId?: string;
  recipientName?: string;
}

interface Room {
  id: string;
  maxPlayers: number;
  players: Player[];
  isPlaying: boolean;
  history?: any[];
  actionLogs?: ActionLog[];
}

interface ScoreBoardProps {
  room: Room;
  currentPlayerId: string;
  onUpdateScore: (playerId: string, points: number) => void;
  onUndoScore: () => void;
  onLeaveRoom: () => void;
}

type ScoreMode = 'personal' | 'mutual';

const ScoreBoard: React.FC<ScoreBoardProps> = ({ room, currentPlayerId, onUpdateScore, onUndoScore, onLeaveRoom }) => {
  const [scoreMode, setScoreMode] = useState<ScoreMode>('personal');
  const [points, setPoints] = useState<string>('1');
  const [mutualPlayer1, setMutualPlayer1] = useState<string>('');
  const [mutualPlayer2, setMutualPlayer2] = useState<string>('');

  const canUndo = room.history && room.history.length > 0;

  const handlePersonalAddScore = () => {
    const numPoints = Number(points) || 0;
    onUpdateScore(currentPlayerId, numPoints);
  };

  const handlePersonalSubtractScore = () => {
    const numPoints = Number(points) || 0;
    onUpdateScore(currentPlayerId, -numPoints);
  };

  const handleMutualScore = () => {
    if (mutualPlayer1 && mutualPlayer2 && mutualPlayer1 !== mutualPlayer2) {
      const numPoints = Number(points) || 0;
      onUpdateScore(mutualPlayer1, numPoints);
      onUpdateScore(mutualPlayer2, -numPoints);
    }
  };

  const handleMutualReverseScore = () => {
    if (mutualPlayer1 && mutualPlayer2 && mutualPlayer1 !== mutualPlayer2) {
      const numPoints = Number(points) || 0;
      onUpdateScore(mutualPlayer1, -numPoints);
      onUpdateScore(mutualPlayer2, numPoints);
    }
  };

  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 cute-pattern flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 star-pattern"></div>
      <div className="bg-slate-900/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-4xl w-full border border-violet-500/40 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"><span className="text-5xl">🎮</span> 计分游戏 - 分数板 <span className="text-5xl">✨</span></h2>
        
        <div className="mb-6 p-4 bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50 rounded-xl border border-violet-500/40">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-purple-300">🔑 房间码</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{room.id}</p>
            </div>
            <div>
              <p className="text-sm text-purple-300">👥 玩家人数</p>
              <p className="text-2xl font-bold text-white">{room.players.length}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-purple-300">🏆 玩家分数</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  player.id === currentPlayerId 
                    ? 'bg-gradient-to-r from-violet-900/50 to-fuchsia-900/50 border-violet-400' 
                    : 'bg-slate-800/50 border-slate-600 hover:bg-slate-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                      ['bg-gradient-to-br from-red-500 to-pink-500', 'bg-gradient-to-br from-blue-500 to-cyan-500', 'bg-gradient-to-br from-green-500 to-emerald-500', 'bg-gradient-to-br from-yellow-500 to-orange-500', 'bg-gradient-to-br from-purple-500 to-violet-500', 'bg-gradient-to-br from-pink-500 to-rose-500', 'bg-gradient-to-br from-indigo-500 to-blue-500', 'bg-gradient-to-br from-orange-500 to-red-500', 'bg-gradient-to-br from-teal-500 to-green-500', 'bg-gradient-to-br from-lime-500 to-green-500'][index % 10]
                    }`}>
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white">{player.name}</p>
                      {player.id === currentPlayerId && (
                        <p className="text-xs bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white inline-block px-2 py-1 rounded-full shadow-md">👤 你</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{player.score}</p>
                    <p className="text-sm text-purple-400">分数</p>
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
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                scoreMode === 'personal' 
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/40' 
                  : 'bg-slate-800 text-purple-300 hover:bg-slate-700'
              }`}
            >
              🎯 给自己加减分
            </button>
            <button
              onClick={() => setScoreMode('mutual')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                scoreMode === 'mutual' 
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/40' 
                  : 'bg-slate-800 text-purple-300 hover:bg-slate-700'
              }`}
            >
              🤝 互相加减分
            </button>
          </div>

          <h3 className="text-lg font-semibold mb-4 text-purple-300">
            {scoreMode === 'personal' ? '🎯 给自己加减分' : '🤝 互相加减分'}
          </h3>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 rounded-xl space-y-4 border border-violet-500/40">
            {scoreMode === 'personal' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    🔢 分数
                  </label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || value === '-') {
                        setPoints('');
                      } else {
                        const num = Number(value);
                        if (!isNaN(num) && num >= 0) {
                          // Remove leading zeros by converting to number and back to string
                          setPoints(num.toString());
                        }
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '' || e.target.value === '-') {
                        setPoints('');
                      }
                    }}
                    min="0"
                    step="0.5"
                    placeholder="输入分数"
                    className="w-full px-4 py-3 border border-violet-500/40 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 bg-slate-800/70 text-white placeholder-purple-400"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handlePersonalAddScore}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/40"
                  >
                    ➕ 给自己加分
                  </button>
                  <button
                    onClick={handlePersonalSubtractScore}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-red-500/40"
                  >
                    ➖ 给自己减分
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      👤 玩家 A
                    </label>
                    <select
                      value={mutualPlayer1}
                      onChange={(e) => setMutualPlayer1(e.target.value)}
                      className="w-full px-4 py-3 border border-violet-500/40 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 bg-slate-800/70 text-white"
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
                    <label className="block text-sm font-medium text-purple-300 mb-2">
                      👤 玩家 B
                    </label>
                    <select
                      value={mutualPlayer2}
                      onChange={(e) => setMutualPlayer2(e.target.value)}
                      className="w-full px-4 py-3 border border-violet-500/40 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 bg-slate-800/70 text-white"
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
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    🔢 分数
                  </label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || value === '-') {
                        setPoints('');
                      } else {
                        const num = Number(value);
                        if (!isNaN(num) && num >= 0) {
                          // Remove leading zeros by converting to number and back to string
                          setPoints(num.toString());
                        }
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === '' || e.target.value === '-') {
                        setPoints('');
                      }
                    }}
                    min="0"
                    step="0.5"
                    placeholder="输入分数"
                    className="w-full px-4 py-3 border border-violet-500/40 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 bg-slate-800/70 text-white placeholder-purple-400"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleMutualScore}
                    disabled={!mutualPlayer1 || !mutualPlayer2 || mutualPlayer1 === mutualPlayer2}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/40 disabled:opacity-50"
                  >
                    ➕ 玩家 A +{points || 0}，玩家 B -{points || 0}
                  </button>
                  <button
                    onClick={handleMutualReverseScore}
                    disabled={!mutualPlayer1 || !mutualPlayer2 || mutualPlayer1 === mutualPlayer2}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-300 shadow-lg shadow-orange-500/40 disabled:opacity-50"
                  >
                    🔄 玩家 A -{points || 0}，玩家 B +{points || 0}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={onUndoScore}
            disabled={!canUndo}
            className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-yellow-500/40 disabled:opacity-50"
          >
            ↩️ 撤销上一步
          </button>
          <button
            onClick={onLeaveRoom}
            className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg shadow-red-500/40"
          >
            🚪 离开房间
          </button>
        </div>

        {room.actionLogs && room.actionLogs.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-purple-300">📜 操作记录</h3>
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4 rounded-xl border border-violet-500/40 max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {[...room.actionLogs].reverse().slice(0, 20).map((log) => {
                  const isActor = log.actorId === currentPlayerId;
                  const isTarget = log.targetId === currentPlayerId;
                  
                  let actionText = '';
                  let actionEmoji = '';
                  let actionColor = '';
                  
                  if (log.action === 'transfer') {
                    actionEmoji = '🏆';
                    actionColor = 'text-blue-400';
                    actionText = `${log.targetName} 从 ${log.actorName} 赢得了 ${log.amount} 分`;
                  } else if (log.action === 'add') {
                    actionEmoji = '➕';
                    actionColor = 'text-green-400';
                    if (log.actorId === log.targetId) {
                      actionText = `${log.actorName} 给自己加了 ${log.amount} 分`;
                    } else {
                      actionText = `${log.actorName} 给 ${log.targetName} 加了 ${log.amount} 分`;
                    }
                  } else if (log.action === 'deduct') {
                    actionEmoji = '➖';
                    actionColor = 'text-red-400';
                    if (log.actorId === log.targetId) {
                      actionText = `${log.actorName} 给自己减了 ${log.amount} 分`;
                    } else {
                      actionText = `${log.actorName} 给 ${log.targetName} 减了 ${log.amount} 分`;
                    }
                  }
                  
                  const timeStr = new Date(log.timestamp).toLocaleTimeString('zh-CN', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  });
                  
                  return (
                    <div 
                      key={log.id}
                      className={`p-3 rounded-lg border transition-all ${
                        isActor || isTarget
                          ? 'bg-violet-900/30 border-violet-500/50' 
                          : 'bg-slate-800/50 border-slate-700/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${actionColor}`}>
                            {actionEmoji} {actionText}
                          </p>
                        </div>
                        <span className="text-xs text-purple-400 whitespace-nowrap">{timeStr}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-purple-400">
          <p>🎯 给自己加减分：只能给自己加分或减分</p>
          <p>🤝 互相加减分：选择两个玩家，一个加分一个减分</p>
          <p>↩️ 撤销：回退到上一次记分操作</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;