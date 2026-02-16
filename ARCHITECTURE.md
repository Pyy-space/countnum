# Code Architecture Documentation

## Overview

This document describes the refactored architecture of the countnum multiplayer scoring application. The codebase has been reorganized to follow best practices for maintainability, scalability, and robustness.

## Directory Structure

```
src/
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces and types
├── services/           # Business logic services
│   ├── roomService.ts  # Room management (create, join, validate)
│   └── gameService.ts  # Game state management (ready, start, score)
├── utils/              # Utility functions
│   ├── logger.ts       # Logging utility
│   └── validation.ts   # Input validation functions
├── App.tsx             # Main application component
├── Lobby.tsx           # Lobby/menu screen
├── WaitingRoom.tsx     # Waiting room for players
└── ScoreBoard.tsx      # Score board during game
```

## Architecture Principles

### 1. Separation of Concerns
- **Components**: Handle UI rendering and user interactions
- **Services**: Contain business logic and state transformations
- **Utils**: Provide reusable utility functions
- **Types**: Define data structures and interfaces

### 2. Single Responsibility
Each module has a clear, focused purpose:
- `roomService.ts`: Room creation and joining logic
- `gameService.ts`: Game state and player management
- `validation.ts`: Input validation rules
- `logger.ts`: Logging functionality

### 3. Error Handling
- All service functions return `OperationResult<T>` with success/error states
- Errors are logged and propagated to UI for user feedback
- Validation happens before operations to fail fast

### 4. Logging
- Comprehensive logging at INFO, WARN, ERROR, and DEBUG levels
- Logs include contextual data for debugging
- Development mode enables debug logs

## Key Modules

### Types (`src/types/index.ts`)

Defines core data structures:

```typescript
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

interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Room Service (`src/services/roomService.ts`)

Handles room-related operations:

**Functions:**
- `createRoom(config)`: Create a new game room
- `joinRoom(config)`: Join an existing room
- `generateRoomCode()`: Generate unique 6-character room codes
- `generatePlayerId()`: Generate unique player IDs
- `isRoomFull(room)`: Check if room is at capacity
- `hasMinimumPlayers(room)`: Check if minimum players present

**Features:**
- Input validation before operations
- Unique room code generation (6 alphanumeric characters)
- Player ID generation with timestamp and random suffix
- Mock room joining (ready for backend integration)

### Game Service (`src/services/gameService.ts`)

Manages game state and player actions:

**Functions:**
- `updatePlayerReadyStatus(room, playerId, isReady)`: Update player ready state
- `startGame(room)`: Start the game (validates minimum players and ready status)
- `updatePlayerScore(room, playerId, points)`: Update player scores
- `removePlayerFromRoom(room, playerId)`: Remove player from room
- `areAllPlayersReady(room)`: Check if all players are ready
- `resetPlayersReadyStatus(room)`: Reset all players to not ready

**Features:**
- Validates all players are ready before starting
- Requires minimum 2 players to start
- Supports adding/subtracting points
- Immutable state updates (returns new room objects)

### Validation Utils (`src/utils/validation.ts`)

Input validation functions:

**Functions:**
- `validatePlayerName(name)`: 1-20 characters, non-empty
- `validateRoomCode(code)`: Exactly 6 alphanumeric uppercase characters
- `validateMaxPlayers(count)`: Between 2 and 10 players
- `validateScorePoints(points)`: Numeric validation
- `validatePlayerId(playerId, playerIds)`: Check player exists in room

### Logger (`src/utils/logger.ts`)

Structured logging utility:

**Features:**
- Log levels: INFO, WARN, ERROR, DEBUG
- Timestamps on all logs
- Development vs production modes
- Contextual data logging

**Usage:**
```typescript
import { logger } from './utils/logger';

logger.info('Room created', { roomId: 'ABC123' });
logger.warn('Validation failed', { error: 'Invalid input' });
logger.error('Operation failed', error);
logger.debug('Debug info', { data });
```

## App.tsx Refactoring

The main App component has been refactored to:

1. **Use Service Layer**: All business logic moved to services
2. **Enhanced Error Handling**: Errors captured and displayed to users
3. **Comprehensive Logging**: All operations logged for debugging
4. **JSDoc Comments**: Detailed documentation for all functions
5. **Clear Separation**: Component focuses on state management and UI coordination

### Key Functions

- `onCreateRoom(playerName, maxPlayers)`: Create room handler
- `onJoinRoom(roomId, playerName)`: Join room handler
- `onSetReady(isReady)`: Toggle ready status
- `onStartGame()`: Start game handler
- `onUpdateScore(playerId, points)`: Update score handler
- `onLeaveRoom()`: Leave room and return to lobby

All functions include:
- Input validation via services
- Error handling and user feedback
- Comprehensive logging
- State updates on success

## Error Handling Pattern

All operations follow this pattern:

```typescript
const result = serviceFunction(params);

if (result.success && result.data) {
  // Update state with new data
  setState(result.data);
  logger.info('Operation succeeded');
} else {
  // Display error to user
  setError(result.error || 'Operation failed');
  logger.error('Operation failed', { error: result.error });
}
```

## Future Enhancements

### Backend Integration
The current implementation is client-side only. To add backend:

1. **Replace mock data** in `joinRoom()` with API calls
2. **Add WebSocket/API client** for real-time updates
3. **Implement room persistence** via backend
4. **Add authentication** for players

### Additional Features
- **Room settings**: Configurable game rules
- **Chat system**: Player communication
- **History tracking**: Game statistics and history
- **Reconnection**: Handle disconnects gracefully
- **Admin controls**: Room creator can kick/ban players

## Testing

Run manual tests:
```bash
npx tsx src/manualTests.ts
```

The test suite validates:
- Input validation
- Room creation and joining
- Ready status management
- Game start logic
- Score updates
- Edge cases and error conditions

## Development

**Start development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## Best Practices

1. **Type Safety**: Use TypeScript types consistently
2. **Immutability**: Never mutate state directly, always create new objects
3. **Validation**: Validate inputs before processing
4. **Error Handling**: Always handle errors gracefully
5. **Logging**: Log important operations for debugging
6. **Documentation**: Keep JSDoc comments up to date
7. **Testing**: Test edge cases and error conditions

## Conclusion

This refactored architecture provides:
- ✅ Clear separation of concerns
- ✅ Robust error handling
- ✅ Comprehensive logging
- ✅ Type safety
- ✅ Maintainable code structure
- ✅ Scalability for future features
- ✅ Better debugging capabilities
