import express, { Request, Response } from 'express';
import cors from 'cors';
import { RoomStore } from './store';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - allow requests from multiple frontend origins
const CORS_ORIGINS = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'https://pyy-space.github.io'];

app.use(cors({
  origin: CORS_ORIGINS,
  credentials: true
}));
app.use(express.json());

// In-memory store
const roomStore = new RoomStore();

// Logging middleware
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Helper to generate room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    rooms: roomStore.getRoomCount()
  });
});

// Create a new room
app.post('/api/rooms', (req: Request, res: Response) => {
  try {
    const { playerName, maxPlayers } = req.body;

    if (!playerName || typeof playerName !== 'string' || playerName.trim().length === 0) {
      return res.status(400).json({ error: 'Player name is required' });
    }

    if (!maxPlayers || typeof maxPlayers !== 'number' || maxPlayers < 2 || maxPlayers > 10) {
      return res.status(400).json({ error: 'Max players must be between 2 and 10' });
    }

    const roomId = generateRoomCode();
    const { room, playerId } = roomStore.createRoom(roomId, maxPlayers, playerName.trim());

    console.log(`Room ${roomId} created by ${playerName} (${playerId})`);
    
    res.status(201).json({ room, playerId });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Join an existing room
app.post('/api/rooms/:roomId/join', (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { playerName } = req.body;

    if (!playerName || typeof playerName !== 'string' || playerName.trim().length === 0) {
      return res.status(400).json({ error: 'Player name is required' });
    }

    const result = roomStore.joinRoom(roomId.toUpperCase(), playerName.trim());
    
    if (!result) {
      return res.status(404).json({ error: 'Room not found' });
    }

    console.log(`${playerName} (${result.playerId}) joined room ${roomId}`);
    
    res.json({ room: result.room, playerId: result.playerId });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to join room';
    console.error('Error joining room:', error);
    res.status(400).json({ error: errorMessage });
  }
});

// Get room state
app.get('/api/rooms/:roomId', (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const room = roomStore.getRoom(roomId.toUpperCase());

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ room });
  } catch (error) {
    console.error('Error getting room:', error);
    res.status(500).json({ error: 'Failed to get room' });
  }
});

// Set player ready status
app.put('/api/rooms/:roomId/ready', (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { playerId, isReady } = req.body;

    if (!playerId || typeof isReady !== 'boolean') {
      return res.status(400).json({ error: 'Player ID and ready status are required' });
    }

    const room = roomStore.setPlayerReady(roomId.toUpperCase(), playerId, isReady);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    console.log(`Player ${playerId} in room ${roomId} set ready: ${isReady}`);
    
    res.json({ room });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to set ready status';
    console.error('Error setting ready status:', error);
    res.status(400).json({ error: errorMessage });
  }
});

// Start game
app.post('/api/rooms/:roomId/start', (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const room = roomStore.startGame(roomId.toUpperCase());

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    console.log(`Game started in room ${roomId}`);
    
    res.json({ room });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to start game';
    console.error('Error starting game:', error);
    res.status(400).json({ error: errorMessage });
  }
});

// Update player score
app.put('/api/rooms/:roomId/score', (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { playerId, points } = req.body;

    if (!playerId || typeof points !== 'number') {
      return res.status(400).json({ error: 'Player ID and points are required' });
    }

    const room = roomStore.updateScore(roomId.toUpperCase(), playerId, points);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    console.log(`Player ${playerId} in room ${roomId} scored ${points} points`);
    
    res.json({ room });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update score';
    console.error('Error updating score:', error);
    res.status(400).json({ error: errorMessage });
  }
});

// Undo last score change
app.post('/api/rooms/:roomId/undo', (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const room = roomStore.undoScore(roomId.toUpperCase());

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    console.log(`Undo score change in room ${roomId}`);
    
    res.json({ room });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to undo score';
    console.error('Error undoing score:', error);
    res.status(400).json({ error: errorMessage });
  }
});

// Leave room
app.delete('/api/rooms/:roomId/leave', (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const { playerId } = req.body;

    if (!playerId) {
      return res.status(400).json({ error: 'Player ID is required' });
    }

    const { room, wasDeleted } = roomStore.leaveRoom(roomId.toUpperCase(), playerId);

    console.log(`Player ${playerId} left room ${roomId}${wasDeleted ? ' (room deleted)' : ''}`);
    
    res.json({ room, wasDeleted });
  } catch (error) {
    console.error('Error leaving room:', error);
    res.status(500).json({ error: 'Failed to leave room' });
  }
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Periodic cleanup of old rooms (every hour)
setInterval(() => {
  roomStore.cleanupOldRooms();
  console.log(`[${new Date().toISOString()}] Cleaned up old rooms`);
}, 60 * 60 * 1000);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
