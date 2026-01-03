#!/bin/bash

# Disease Prediction Service - Startup Script

echo "🚀 Starting Disease Prediction Service..."
echo ""

# Navigate to service directory
cd "$(dirname "$0")"

# Activate virtual environment
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Run: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

echo "✅ Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
python -c "import fastapi" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
fi

# Start the service
echo ""
echo "🏥 Disease Prediction Service"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📍 URL:  http://localhost:8002"
echo "📖 Docs: http://localhost:8002/docs"
echo "🏥 Health: http://localhost:8002/health"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run the service
python main.py
