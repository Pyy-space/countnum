export interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
}

export interface Room {
  id: string;
  maxPlayers: number;
  players: Player[];
  isPlaying: boolean;
  createdAt: Date;
  history: RoomHistory[];
}

export interface RoomHistory {
  timestamp: number;
  players: Player[];
}

export class RoomStore {
  private rooms: Map<string, Room> = new Map();
  private playerToRoom: Map<string, string> = new Map();

  createRoom(roomId: string, maxPlayers: number, playerName: string): { room: Room; playerId: string } {
    const playerId = `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const room: Room = {
      id: roomId,
      maxPlayers,
      players: [{
        id: playerId,
        name: playerName,
        score: 0,
        isReady: false
      }],
      isPlaying: false,
      createdAt: new Date(),
      history: []
    };

    this.rooms.set(roomId, room);
    this.playerToRoom.set(playerId, roomId);

    return { room, playerId };
  }

  joinRoom(roomId: string, playerName: string): { room: Room; playerId: string } | null {
    const room = this.rooms.get(roomId);
    if (!room) {
      return null;
    }

    if (room.players.length >= room.maxPlayers) {
      throw new Error('Room is full');
    }

    if (room.isPlaying) {
      throw new Error('Game already started');
    }

    const playerId = `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    room.players.push({
      id: playerId,
      name: playerName,
      score: 0,
      isReady: false
    });

    this.playerToRoom.set(playerId, roomId);

    return { room, playerId };
  }

  getRoom(roomId: string): Room | null {
    return this.rooms.get(roomId) || null;
  }

  setPlayerReady(roomId: string, playerId: string, isReady: boolean): Room | null {
    const room = this.rooms.get(roomId);
    if (!room) {
      return null;
    }

    const player = room.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found in room');
    }

    player.isReady = isReady;
    return room;
  }

  startGame(roomId: string): Room | null {
    const room = this.rooms.get(roomId);
    if (!room) {
      return null;
    }

    if (room.players.length < 2) {
      throw new Error('Need at least 2 players to start');
    }

    const allReady = room.players.every(p => p.isReady);
    if (!allReady) {
      throw new Error('Not all players are ready');
    }

    room.isPlaying = true;
    return room;
  }

  updateScore(roomId: string, playerId: string, points: number): Room | null {
    const room = this.rooms.get(roomId);
    if (!room) {
      return null;
    }

    const player = room.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found in room');
    }

    player.score += points;

    this.addHistory(room);

    return room;
  }

  undoScore(roomId: string): Room | null {
    const room = this.rooms.get(roomId);
    if (!room) {
      return null;
    }

    if (room.history.length === 0) {
      throw new Error('No history to undo');
    }

    const lastState = room.history.pop();
    if (lastState) {
      room.players = lastState.players;
    }

    return room;
  }

  private addHistory(room: Room): void {
    const historyEntry: RoomHistory = {
      timestamp: Date.now(),
      players: JSON.parse(JSON.stringify(room.players))
    };

    room.history.push(historyEntry);

    if (room.history.length > 50) {
      room.history.shift();
    }
  }

  leaveRoom(roomId: string, playerId: string): { room: Room | null; wasDeleted: boolean } {
    const room = this.rooms.get(roomId);
    if (!room) {
      return { room: null, wasDeleted: false };
    }

    room.players = room.players.filter(p => p.id !== playerId);
    this.playerToRoom.delete(playerId);

    if (room.players.length === 0) {
      this.rooms.delete(roomId);
      return { room: null, wasDeleted: true };
    }

    return { room, wasDeleted: false };
  }

  cleanupOldRooms(maxAgeMs: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    for (const [roomId, room] of this.rooms.entries()) {
      if (now - room.createdAt.getTime() > maxAgeMs) {
        for (const player of room.players) {
          this.playerToRoom.delete(player.id);
        }
        this.rooms.delete(roomId);
      }
    }
  }

  getRoomCount(): number {
    return this.rooms.size;
  }
}