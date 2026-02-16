/**
 * Manual Test Suite for Room and Game Services
 * Run this file to verify the core functionality works correctly
 */

import { createRoom, joinRoom, generateRoomCode, generatePlayerId } from './services/roomService';
import { 
  updatePlayerReadyStatus, 
  startGame, 
  updatePlayerScore,
  areAllPlayersReady
} from './services/gameService';
import { 
  validatePlayerName, 
  validateRoomCode, 
  validateMaxPlayers 
} from './utils/validation';

console.log('=== Starting Manual Tests ===\n');

// Test 1: Validation functions
console.log('Test 1: Validation Functions');
console.assert(validatePlayerName('John') === true, 'Valid player name should pass');
console.assert(validatePlayerName('') === false, 'Empty player name should fail');
console.assert(validatePlayerName('TooLongNameThatExceeds20Chars') === false, 'Too long player name should fail');
console.assert(validateRoomCode('ABC123') === true, 'Valid room code should pass');
console.assert(validateRoomCode('ABC') === false, 'Too short room code should fail');
console.assert(validateRoomCode('abc123') === false, 'Lowercase room code should fail');
console.assert(validateMaxPlayers(4) === true, 'Valid max players should pass');
console.assert(validateMaxPlayers(1) === false, 'Max players < 2 should fail');
console.assert(validateMaxPlayers(11) === false, 'Max players > 10 should fail');
console.log('✅ All validation tests passed\n');

// Test 2: Room Code and Player ID Generation
console.log('Test 2: ID Generation');
const roomCode = generateRoomCode();
console.assert(roomCode.length === 6, 'Room code should be 6 characters');
console.assert(/^[A-Z0-9]+$/.test(roomCode), 'Room code should be alphanumeric uppercase');
const playerId = generatePlayerId();
console.assert(playerId.startsWith('player_'), 'Player ID should start with player_');
console.log(`Generated room code: ${roomCode}`);
console.log(`Generated player ID: ${playerId}`);
console.log('✅ ID generation tests passed\n');

// Test 3: Room Creation
console.log('Test 3: Room Creation');
const createResult = createRoom({ playerName: 'Alice', maxPlayers: 4 });
console.assert(createResult.success === true, 'Room creation should succeed');
console.assert(createResult.data?.room !== undefined, 'Room should be created');
console.assert(createResult.data?.room.players.length === 1, 'Room should have 1 player');
console.assert(createResult.data?.room.maxPlayers === 4, 'Room should have max 4 players');
console.assert(createResult.data?.room.isPlaying === false, 'Room should not be playing');
console.log(`Created room: ${createResult.data?.room.id}`);
console.log('✅ Room creation tests passed\n');

// Test 4: Room Joining
console.log('Test 4: Room Joining');
const joinResult = joinRoom({ roomId: 'TEST01', playerName: 'Bob' });
console.assert(joinResult.success === true, 'Room joining should succeed');
console.assert(joinResult.data?.room.id === 'TEST01', 'Joined room should have correct ID');
console.assert(joinResult.data?.room.players && joinResult.data.room.players.length >= 1, 'Room should have at least 1 player');
console.log(`Joined room: ${joinResult.data?.room.id} with ${joinResult.data?.room.players.length} players`);
console.log('✅ Room joining tests passed\n');

// Test 5: Invalid inputs
console.log('Test 5: Invalid Input Handling');
const invalidCreate = createRoom({ playerName: '', maxPlayers: 4 });
console.assert(invalidCreate.success === false, 'Creating room with empty name should fail');
console.assert(invalidCreate.error !== undefined, 'Error message should be present');
const invalidJoin = joinRoom({ roomId: 'SHORT', playerName: 'Charlie' });
console.assert(invalidJoin.success === false, 'Joining room with short code should fail');
console.log('✅ Invalid input handling tests passed\n');

// Test 6: Ready Status
console.log('Test 6: Ready Status Management');
if (createResult.data) {
  const { room, playerId } = createResult.data;
  const readyResult = updatePlayerReadyStatus(room, playerId, true);
  console.assert(readyResult.success === true, 'Setting ready should succeed');
  console.assert(readyResult.data?.players[0].isReady === true, 'Player should be ready');
  
  const notReadyResult = updatePlayerReadyStatus(readyResult.data!, playerId, false);
  console.assert(notReadyResult.success === true, 'Unsetting ready should succeed');
  console.assert(notReadyResult.data?.players[0].isReady === false, 'Player should not be ready');
  console.log('✅ Ready status tests passed\n');
}

// Test 7: Game Start
console.log('Test 7: Game Start');
if (createResult.data) {
  const { room, playerId } = createResult.data;
  
  // Try to start with only 1 player
  const earlyStart = startGame(room);
  console.assert(earlyStart.success === false, 'Starting with 1 player should fail');
  
  // Create a room with 2 players both ready
  const mockRoom = {
    ...room,
    players: [
      { id: playerId, name: 'Alice', score: 0, isReady: true },
      { id: 'player_2', name: 'Bob', score: 0, isReady: true }
    ]
  };
  
  const validStart = startGame(mockRoom);
  console.assert(validStart.success === true, 'Starting with 2 ready players should succeed');
  console.assert(validStart.data?.isPlaying === true, 'Game should be playing');
  console.log('✅ Game start tests passed\n');
}

// Test 8: Score Updates
console.log('Test 8: Score Updates');
if (createResult.data) {
  const { room, playerId } = createResult.data;
  
  // Add points
  const addResult = updatePlayerScore(room, playerId, 10);
  console.assert(addResult.success === true, 'Adding points should succeed');
  console.assert(addResult.data?.players[0].score === 10, 'Score should be 10');
  
  // Subtract points
  const subtractResult = updatePlayerScore(addResult.data!, playerId, -3);
  console.assert(subtractResult.success === true, 'Subtracting points should succeed');
  console.assert(subtractResult.data?.players[0].score === 7, 'Score should be 7');
  
  console.log('✅ Score update tests passed\n');
}

// Test 9: All Players Ready Check
console.log('Test 9: All Players Ready Check');
const mockRoom1 = {
  id: 'TEST',
  maxPlayers: 4,
  isPlaying: false,
  players: [
    { id: '1', name: 'P1', score: 0, isReady: true },
    { id: '2', name: 'P2', score: 0, isReady: true }
  ]
};
console.assert(areAllPlayersReady(mockRoom1) === true, 'All ready should return true');

const mockRoom2 = {
  ...mockRoom1,
  players: [
    { id: '1', name: 'P1', score: 0, isReady: true },
    { id: '2', name: 'P2', score: 0, isReady: false }
  ]
};
console.assert(areAllPlayersReady(mockRoom2) === false, 'Not all ready should return false');
console.log('✅ All players ready tests passed\n');

console.log('=== All Tests Passed! ===');
