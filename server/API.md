# API Documentation

## Base URL
- Development: `http://localhost:3001/api`
- Production: Configure via `PORT` environment variable

## Endpoints

### Health Check
**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-16T10:41:10.839Z",
  "rooms": 0
}
```

---

### Create Room
**POST** `/rooms`

Create a new game room.

**Request Body:**
```json
{
  "playerName": "string (required)",
  "maxPlayers": "number (2-10, required)"
}
```

**Response:**
```json
{
  "room": {
    "id": "ABCD12",
    "maxPlayers": 4,
    "players": [{
      "id": "player_1234567890_abc123",
      "name": "Player Name",
      "score": 0,
      "isReady": false
    }],
    "isPlaying": false,
    "createdAt": "2026-02-16T10:41:16.460Z"
  },
  "playerId": "player_1234567890_abc123"
}
```

**Errors:**
- `400` - Invalid player name or max players

---

### Join Room
**POST** `/rooms/:roomId/join`

Join an existing room.

**Parameters:**
- `roomId` - Room code (case-insensitive)

**Request Body:**
```json
{
  "playerName": "string (required)"
}
```

**Response:**
```json
{
  "room": { /* Room object */ },
  "playerId": "player_1234567890_xyz789"
}
```

**Errors:**
- `400` - Room is full or game already started
- `404` - Room not found

---

### Get Room State
**GET** `/rooms/:roomId`

Get the current state of a room.

**Parameters:**
- `roomId` - Room code (case-insensitive)

**Response:**
```json
{
  "room": { /* Room object */ }
}
```

**Errors:**
- `404` - Room not found

---

### Set Ready Status
**PUT** `/rooms/:roomId/ready`

Set a player's ready status.

**Parameters:**
- `roomId` - Room code

**Request Body:**
```json
{
  "playerId": "string (required)",
  "isReady": "boolean (required)"
}
```

**Response:**
```json
{
  "room": { /* Updated room object */ }
}
```

**Errors:**
- `400` - Player not found in room
- `404` - Room not found

---

### Start Game
**POST** `/rooms/:roomId/start`

Start the game in a room.

**Parameters:**
- `roomId` - Room code

**Response:**
```json
{
  "room": { /* Updated room object with isPlaying: true */ }
}
```

**Errors:**
- `400` - Not enough players (minimum 2) or not all players are ready
- `404` - Room not found

---

### Update Score
**PUT** `/rooms/:roomId/score`

Update a player's score.

**Parameters:**
- `roomId` - Room code

**Request Body:**
```json
{
  "playerId": "string (required)",
  "points": "number (required)"
}
```

**Response:**
```json
{
  "room": { /* Updated room object with new score */ }
}
```

**Errors:**
- `400` - Player not found in room
- `404` - Room not found

---

### Leave Room
**DELETE** `/rooms/:roomId/leave`

Remove a player from a room.

**Parameters:**
- `roomId` - Room code

**Request Body:**
```json
{
  "playerId": "string (required)"
}
```

**Response:**
```json
{
  "room": { /* Updated room object or null if room was deleted */ },
  "wasDeleted": false
}
```

**Notes:**
- If the last player leaves, the room is automatically deleted

---

## Data Models

### Room
```typescript
{
  id: string;           // 6-character room code
  maxPlayers: number;   // 2-10
  players: Player[];
  isPlaying: boolean;
  createdAt: Date;
}
```

### Player
```typescript
{
  id: string;
  name: string;
  score: number;
  isReady: boolean;
}
```

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider adding rate limiting middleware.

## CORS

CORS is enabled for all origins in development. For production, configure CORS to only allow your frontend domain.

## Room Cleanup

Rooms are automatically cleaned up after 24 hours of inactivity. This cleanup runs every hour.
