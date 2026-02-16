#!/bin/bash

# Setup script for countnum multiplayer game
# This script installs all dependencies for both frontend and backend

set -e

echo "🚀 Setting up countnum - Multiplayer Scoring Game"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js (v16 or higher) from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    exit 1
fi

echo "✅ npm $(npm --version) detected"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start the application:"
echo "  npm run dev:all    - Run both frontend and backend"
echo "  npm run dev        - Run frontend only"
echo "  npm run server     - Run backend only"
echo ""
echo "Access the application at:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3001"
echo ""
