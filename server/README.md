# Countnum Backend Server

This is the backend server for the Countnum multiplayer scoring game, built with Express and TypeScript.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **CORS**: Enabled for frontend communication

## API Endpoints

The server provides the following REST API endpoints:

- `GET /api/health` - Health check endpoint
- `POST /api/rooms` - Create a new game room
- `POST /api/rooms/:roomId/join` - Join an existing room
- `GET /api/rooms/:roomId` - Get current room state
- `PUT /api/rooms/:roomId/ready` - Set player ready status
- `POST /api/rooms/:roomId/start` - Start the game
- `PUT /api/rooms/:roomId/score` - Update player score
- `DELETE /api/rooms/:roomId/leave` - Leave a room

For detailed API documentation, see [API.md](./API.md).

## Local Development

### Prerequisites
- Node.js v16 or higher
- npm

### Installation

```bash
# From the server directory
npm install
```

### Environment Variables

Create a `.env` file in the server directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Required environment variables:

- `PORT` - Server port (default: 3000)
- `CORS_ORIGIN` - Allowed frontend origin for CORS (default: http://localhost:5173)

Example `.env` for local development:
```
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

### Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production build**:
```bash
npm run build
npm start
```

The server will start on the port specified in the `PORT` environment variable (default: 3000).

### Testing the API

You can test the API using curl:

```bash
# Health check
curl http://localhost:3000/api/health

# Create a room
curl -X POST http://localhost:3000/api/rooms \
  -H "Content-Type: application/json" \
  -d '{"playerName": "Player1", "maxPlayers": 4}'
```

## Deployment to Render

### Prerequisites
1. A [Render](https://render.com) account
2. GitHub repository connected to Render

### Step-by-Step Deployment Guide

#### 1. Create a New Web Service on Render

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** and select **"Web Service"**
3. Connect your GitHub repository (`Pyy-space/countnum`)
4. Configure the service with the following settings:

#### 2. Service Configuration

**Basic Settings:**
- **Name**: `countnum-backend` (or your preferred name)
- **Region**: Choose the closest region to your users
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

#### 3. Environment Variables

Add the following environment variables in the Render dashboard:

| Key | Value | Description |
|-----|-------|-------------|
| `PORT` | (leave empty) | Render automatically provides this |
| `CORS_ORIGIN` | `https://pyy-space.github.io` | Your frontend URL (update accordingly) |

**Important Notes:**
- Render automatically sets the `PORT` environment variable - you don't need to set it manually
- Update `CORS_ORIGIN` to match your deployed frontend URL
- If deploying frontend to a custom domain, use that domain in `CORS_ORIGIN`

#### 4. Deploy

1. Click **"Create Web Service"**
2. Render will automatically deploy your server
3. Wait for the build and deployment to complete (usually 2-5 minutes)
4. Once deployed, you'll get a URL like: `https://countnum-backend.onrender.com`

#### 5. Verify Deployment

Test your deployed backend:

```bash
# Replace with your actual Render URL
curl https://countnum-backend.onrender.com/api/health
```

You should receive a response like:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "rooms": 0
}
```

#### 6. Update Frontend Configuration

After deploying the backend, you need to update your frontend to use the new backend URL:

1. Update the frontend's environment variables (in `.env` or deployment settings)
2. Set `VITE_API_URL` to your Render backend URL:
   ```
   VITE_API_URL=https://countnum-backend.onrender.com/api
   ```
3. Rebuild and redeploy your frontend

### Render-Specific Features

#### Auto-Deploy
- Render automatically deploys when you push to the configured branch (e.g., `main`)
- You can disable auto-deploy in the service settings if needed

#### Health Checks
- Render automatically monitors your service health
- The `/api/health` endpoint can be used as a health check endpoint
- Configure in Service Settings → Health Check Path: `/api/health`

#### Logs
- View real-time logs in the Render dashboard under "Logs" tab
- Useful for debugging deployment and runtime issues

#### Free Tier Limitations
- Free tier services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds to respond
- Consider upgrading to a paid plan for production use

### Troubleshooting

#### CORS Errors

**Problem**: Frontend shows CORS errors when making API requests

**Solution**: 
1. Verify `CORS_ORIGIN` environment variable is set correctly in Render
2. Ensure it matches your frontend's deployed URL exactly (including `https://`)
3. Check Render logs for CORS-related errors

#### Port Binding Errors

**Problem**: Server fails to start with port-related errors

**Solution**: 
1. Do NOT manually set the `PORT` environment variable in Render
2. Render automatically provides the correct port
3. Ensure your code uses `process.env.PORT` (already configured in this project)

#### Build Failures

**Problem**: Deployment fails during build

**Solution**:
1. Check "Root Directory" is set to `server`
2. Verify Build Command: `npm install && npm run build`
3. Check logs for specific error messages
4. Ensure all TypeScript files compile locally

#### 502 Bad Gateway

**Problem**: API returns 502 errors

**Solution**:
1. Check Render logs for application errors
2. Verify the Start Command: `npm start`
3. Ensure the built `dist/index.js` file exists after build
4. Check that the server is listening on the correct port

### Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Node.js Deployment Guide](https://render.com/docs/deploy-node-express-app)
- [Environment Variables on Render](https://render.com/docs/environment-variables)

## Project Structure

```
server/
├── src/
│   ├── index.ts          # Express server setup and routes
│   └── store.ts          # In-memory data store for rooms/players
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .env.example          # Environment variables template
└── README.md            # This file
```

## Data Storage

The server uses an **in-memory store** for game state:
- Room data is stored in memory
- Data is lost when the server restarts
- Old rooms are automatically cleaned up every hour

**Note**: For production use with persistent data, consider integrating a database like PostgreSQL or MongoDB.

## Contributing

When making changes to the server:
1. Test locally first with `npm run dev`
2. Ensure TypeScript compiles without errors: `npm run build`
3. Test all API endpoints
4. Update this README if adding new features or endpoints

## License
MIT
