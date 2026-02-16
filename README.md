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
- Backend server on http://localhost:3000
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

### Frontend Environment Variables

The frontend uses Vite and requires environment variables prefixed with `VITE_`.

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Configuration:
- `VITE_API_URL` - Backend API URL (default: `http://localhost:3000/api`)

**For local development:**
```env
VITE_API_URL=http://localhost:3000/api
```

**For production (with Render backend):**
```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

### Backend Environment Variables

The backend requires a `.env` file in the `server` directory.

Create it from the example:
```bash
cd server
cp .env.example .env
cd ..
```

Configuration:
- `PORT` - Server port (default: 3000, automatically set by hosting services)
- `CORS_ORIGIN` - Allowed frontend origin (default: `http://localhost:5173`)

**For local development:**
```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

**For production (Render deployment):**
```env
CORS_ORIGIN=https://pyy-space.github.io
# Note: PORT is automatically set by Render, don't set it manually
```

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
curl http://localhost:3000/api/health

# Create a room
curl -X POST http://localhost:3000/api/rooms \
  -H "Content-Type: application/json" \
  -d '{"playerName": "Player1", "maxPlayers": 4}'

# Join a room (replace ROOMCODE with actual room code)
curl -X POST http://localhost:3000/api/rooms/ROOMCODE/join \
  -H "Content-Type: application/json" \
  -d '{"playerName": "Player2"}'
```

## Deployment

This section covers deploying both the frontend and backend to production environments.

### Deploying to Render (Recommended)

Render is a modern cloud platform that makes it easy to deploy both frontend and backend applications.

#### Backend Deployment to Render

**Step 1: Create a Web Service**

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `countnum-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

**Step 2: Set Environment Variables**

Add these environment variables in Render:
- `CORS_ORIGIN`: Set to your frontend URL (e.g., `https://pyy-space.github.io` or `https://your-custom-domain.com`)
- `PORT`: Leave empty (Render sets this automatically)

**Step 3: Deploy**

1. Click **"Create Web Service"**
2. Wait for deployment to complete (2-5 minutes)
3. Note your backend URL: `https://countnum-backend.onrender.com`

**Step 4: Test Backend**

```bash
curl https://countnum-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "rooms": 0
}
```

**Important Notes:**
- ✅ Render **automatically** provides the `PORT` environment variable
- ✅ The backend code is already configured to use `process.env.PORT`
- ✅ CORS is configured to accept requests from `CORS_ORIGIN`
- ⚠️ Free tier services spin down after 15 minutes of inactivity
- ⚠️ First request after spin-down may take 30-60 seconds

For detailed backend deployment instructions, see [server/README.md](./server/README.md).

#### Frontend Deployment to GitHub Pages

The frontend can be deployed to GitHub Pages for free hosting.

**Step 1: Verify Environment Variables**

The repository includes a `.env.production` file with the default production backend URL:

```bash
# .env.production (already in repository)
VITE_API_URL=https://countnum-backend.onrender.com/api
```

If you're using a different backend URL, you can either:
- Update the `.env.production` file before pushing to GitHub, or
- Set a GitHub Secret named `VITE_API_URL` in your repository settings (Settings → Secrets → Actions)

The GitHub Actions workflow will use the secret if available, otherwise it falls back to the value in `.env.production`.

**Step 2: Build the Frontend**

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

**Step 3: Deploy to GitHub Pages**

You can deploy using GitHub Actions or manually:

**Option A: GitHub Actions (Automated)**
1. Go to your repository's Settings → Pages
2. Set Source to "GitHub Actions"
3. The workflow in `.github/workflows/` will automatically deploy on push to main

**Option B: Manual Deployment**
1. Install gh-pages: `npm install -D gh-pages`
2. Add to package.json scripts: `"deploy": "vite build && gh-pages -d dist"`
3. Run: `npm run deploy`

**Step 4: Access Your App**

After deployment, your app will be available at:
- `https://pyy-space.github.io/countnum/`

**Step 5: Update Backend CORS**

Update your backend's `CORS_ORIGIN` environment variable in Render to match your frontend URL:
```
CORS_ORIGIN=https://pyy-space.github.io
```

Then redeploy the backend on Render.

### Alternative Frontend Deployment Options

#### Vercel
1. Import your GitHub repository
2. Set Framework Preset to "Vite"
3. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
4. Deploy

#### Netlify
1. Connect your GitHub repository
2. Set Build command: `npm run build`
3. Set Publish directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### Environment Variable Setup Summary

| Environment | Frontend (`VITE_API_URL`) | Backend (`PORT`) | Backend (`CORS_ORIGIN`) |
|-------------|---------------------------|------------------|-------------------------|
| **Local Development** | `http://localhost:3000/api` | `3000` | `http://localhost:5173` |
| **Production (Render + GitHub Pages)** | `https://countnum-backend.onrender.com/api` | (auto) | `https://pyy-space.github.io` |
| **Production (Render + Vercel)** | `https://countnum-backend.onrender.com/api` | (auto) | `https://your-app.vercel.app` |

### Troubleshooting Deployment

#### "Backend server is not available" Error

**Cause**: Frontend cannot connect to backend

**Solutions**:
1. ✅ Verify backend is deployed and running on Render
2. ✅ Check `VITE_API_URL` is set correctly in frontend
3. ✅ Test backend health: `curl https://your-backend.onrender.com/api/health`
4. ✅ Rebuild frontend after changing environment variables

#### CORS Errors

**Cause**: Backend rejecting requests from frontend

**Solutions**:
1. ✅ Verify `CORS_ORIGIN` is set in Render backend environment variables
2. ✅ Ensure `CORS_ORIGIN` exactly matches your frontend URL (including `https://`)
3. ✅ Check browser console for specific CORS error messages
4. ✅ Restart backend service after changing CORS settings

#### 502 Bad Gateway on Render

**Cause**: Backend server not starting correctly

**Solutions**:
1. ✅ Check Render logs for errors
2. ✅ Verify Start Command is `npm start`
3. ✅ Ensure Build Command is `npm install && npm run build`
4. ✅ Check Root Directory is set to `server`

#### Slow First Request (Render Free Tier)

**Cause**: Free tier services spin down after inactivity

**Solutions**:
1. ⏱️ Wait 30-60 seconds for the service to spin up
2. 💰 Upgrade to a paid Render plan for always-on services
3. 🔄 Use a service like UptimeRobot to ping your backend periodically

### Other Deployment Options

#### Backend Alternatives to Render
- **Railway**: Similar to Render, easy deployment
- **Heroku**: Classic PaaS option (requires credit card for free tier)
- **DigitalOcean App Platform**: Managed app hosting
- **AWS Elastic Beanstalk**: For AWS users
- **Fly.io**: Global edge deployment

#### Full-Stack Deployment
- **Vercel**: Can deploy both frontend and backend (as API routes)
- **Netlify**: Can deploy frontend + backend (as serverless functions)

## Local Development Troubleshooting

### Backend not connecting
1. Ensure the backend server is running on port 3000
2. Check that `VITE_API_URL` in `.env` is set to `http://localhost:3000/api`
3. Check browser console for CORS errors
4. Verify backend is healthy: `curl http://localhost:3000/api/health`

### Build errors
1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules server/node_modules
   npm run install:all
   ```
2. Check Node.js version (v16 or higher required)
3. Clear build cache: `rm -rf dist server/dist`

### Port already in use
If port 3000 or 5173 is already in use:

**Backend (port 3000)**:
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
```

**Frontend (port 5173)**:
```bash
# Find and kill the process
lsof -ti:5173 | xargs kill -9
```

Or change the port in `.env` files.

## License
MIT

## Contributing
Pull requests are welcome! Please feel free to submit issues or suggestions.
