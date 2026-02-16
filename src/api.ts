import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
}

export interface CreateRoomResponse {
  room: Room;
  playerId: string;
}

export interface JoinRoomResponse {
  room: Room;
  playerId: string;
}

export interface UpdateRoomResponse {
  room: Room;
}

class ApiService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async healthCheck(): Promise<{ status: string; timestamp: string; rooms: number }> {
    const response = await this.axiosInstance.get('/health');
    return response.data;
  }

  async createRoom(playerName: string, maxPlayers: number): Promise<CreateRoomResponse> {
    const response = await this.axiosInstance.post('/rooms', {
      playerName,
      maxPlayers,
    });
    return response.data;
  }

  async joinRoom(roomId: string, playerName: string): Promise<JoinRoomResponse> {
    const response = await this.axiosInstance.post(`/rooms/${roomId}/join`, {
      playerName,
    });
    return response.data;
  }

  async getRoom(roomId: string): Promise<{ room: Room }> {
    const response = await this.axiosInstance.get(`/rooms/${roomId}`);
    return response.data;
  }

  async setReady(roomId: string, playerId: string, isReady: boolean): Promise<UpdateRoomResponse> {
    const response = await this.axiosInstance.put(`/rooms/${roomId}/ready`, {
      playerId,
      isReady,
    });
    return response.data;
  }

  async startGame(roomId: string): Promise<UpdateRoomResponse> {
    const response = await this.axiosInstance.post(`/rooms/${roomId}/start`);
    return response.data;
  }

  async updateScore(roomId: string, playerId: string, points: number): Promise<UpdateRoomResponse> {
    const response = await this.axiosInstance.put(`/rooms/${roomId}/score`, {
      playerId,
      points,
    });
    return response.data;
  }

  async undoScore(roomId: string): Promise<UpdateRoomResponse> {
    const response = await this.axiosInstance.post(`/rooms/${roomId}/undo`);
    return response.data;
  }

  async leaveRoom(roomId: string, playerId: string): Promise<{ room: Room | null; wasDeleted: boolean }> {
    const response = await this.axiosInstance.delete(`/rooms/${roomId}/leave`, {
      data: { playerId },
    });
    return response.data;
  }
}

export const apiService = new ApiService();
