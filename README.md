# countnum
用来多人游玩时记分 / Multiplayer scoring game

## Features
- 在线多人计分系统 / Online multiplayer scoring system
- 支持2-10人同时游玩 / Supports 2-10 players
- 实时房间状态同步 / Real-time room state synchronization
- Node.js 后端支持 / Node.js backend support

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Communication**: REST API with polling

## Project Structure
```
countnum/
├── src/                    # Frontend source code
│   ├── App.tsx            # Main application component
│   ├── api.ts             # API service for backend communication
│   ├── Lobby.tsx          # Lobby/room creation component
│   ├── WaitingRoom.tsx    # Waiting room component
│   └── ScoreBoard.tsx     # Score board component
├── server/                 # Backend server
│   ├── src/
│   │   ├── index.ts       # Express server setup
│   │   └── store.ts       # In-memory data store
│   ├── package.json
│   └── tsconfig.json
├── package.json           # Frontend dependencies
└── README.md
```

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Pyy-space/countnum.git
cd countnum
```

2. Install all dependencies (frontend and backend):
```bash
npm run install:all
```

Or install separately:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Running the Application

#### Option 1: Run frontend and backend together (recommended)
```bash
npm run dev:all
```

This will start:
- Backend server on http://localhost:3001
- Frontend dev server on http://localhost:5173

#### Option 2: Run separately
In one terminal, start the backend:
```bash
npm run server
```

In another terminal, start the frontend:
```bash
npm run dev
```

### Building for Production

1. Build the backend:
```bash
npm run server:build
```

2. Build the frontend:
```bash
npm run build
```

3. Start the production backend:
```bash
npm run server:start
```

4. Preview the frontend build:
```bash
npm run preview
```

## Environment Variables

The frontend uses environment variables for configuration. Copy `.env.example` to `.env` and update as needed:

```bash
cp .env.example .env
```

Default configuration:
- `VITE_API_URL=http://localhost:3001/api` - Backend API URL

## API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/health` - Health check
- `POST /api/rooms` - Create a new room
- `POST /api/rooms/:roomId/join` - Join an existing room
- `GET /api/rooms/:roomId` - Get room state
- `PUT /api/rooms/:roomId/ready` - Set player ready status
- `POST /api/rooms/:roomId/start` - Start the game
- `PUT /api/rooms/:roomId/score` - Update player score
- `DELETE /api/rooms/:roomId/leave` - Leave the room

## How to Play

1. Start the application (backend + frontend)
2. Open http://localhost:5173 in your browser
3. Create a room or join an existing one using a room code
4. Wait for other players to join
5. All players mark themselves as ready
6. Start the game and begin scoring!

## Testing the Backend

You can test the backend API using curl:

```bash
# Health check
curl http://localhost:3001/api/health

# Create a room
curl -X POST http://localhost:3001/api/rooms \
  -H "Content-Type: application/json" \
  -d '{"playerName": "Player1", "maxPlayers": 4}'

# Join a room (replace ROOMCODE with actual room code)
curl -X POST http://localhost:3001/api/rooms/ROOMCODE/join \
  -H "Content-Type: application/json" \
  -d '{"playerName": "Player2"}'
```

## Deployment

### GitHub Pages (Frontend)
This site can be deployed to GitHub Pages:
- URL: https://Pyy-space.github.io/countnum/
- Deploy manually via Actions > Deploy to GitHub Pages

**Note**: For GitHub Pages deployment, you'll need to deploy the backend separately (e.g., on Heroku, Railway, or another Node.js hosting service) and update the `VITE_API_URL` environment variable to point to your deployed backend.

### Backend Deployment
The backend can be deployed to any Node.js hosting service:
- Heroku
- Railway
- Render
- DigitalOcean App Platform
- AWS Elastic Beanstalk

Make sure to:
1. Set the `PORT` environment variable if required by your hosting service
2. Update the frontend's `VITE_API_URL` to point to your deployed backend
3. Configure CORS settings if needed

## Troubleshooting

### Backend not connecting
1. Ensure the backend server is running on port 3001
2. Check that `VITE_API_URL` in `.env` is set correctly
3. Check browser console for CORS errors

### Build errors
1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules server/node_modules
   npm run install:all
   ```

## License
MIT

## Contributing
Pull requests are welcome! Please feel free to submit issues or suggestions.
