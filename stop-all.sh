#!/bin/bash

# ==============================================================================
# SHS - Stop All Services Script
# ==============================================================================
# This script stops all running services (Frontend, Backend, AI Service)
# Usage: ./stop-all.sh
# ==============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo -e "\n${BOLD}${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${CYAN}║                                                            ║${NC}"
echo -e "${BOLD}${CYAN}║            🛑 Stopping All SHS Services                    ║${NC}"
echo -e "${BOLD}${CYAN}║                                                            ║${NC}"
echo -e "${BOLD}${CYAN}╚════════════════════════════════════════════════════════════╝${NC}\n"

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$PROJECT_ROOT/.service-pids"

# Stop processes from PID file
if [ -f "$PID_FILE" ]; then
    echo -e "${YELLOW}Stopping services from PID file...${NC}\n"
    while IFS= read -r pid; do
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
            echo -e "${GREEN}✅ Stopped process $pid${NC}"
        fi
    done < "$PID_FILE"
    rm -f "$PID_FILE"
    echo ""
fi

# Kill any remaining processes
echo -e "${YELLOW}Cleaning up any remaining processes...${NC}\n"

# Stop Django backend
if pkill -f "python.*manage.py runserver" 2>/dev/null; then
    echo -e "${GREEN}✅ Stopped Django backend${NC}"
fi

# Stop FastAPI AI service
if pkill -f "uvicorn.*main:app" 2>/dev/null; then
    echo -e "${GREEN}✅ Stopped FastAPI AI service${NC}"
fi

# Stop Vite frontend
if pkill -f "vite" 2>/dev/null; then
    echo -e "${GREEN}✅ Stopped Vite frontend${NC}"
fi

echo -e "\n${BOLD}${GREEN}🎉 All services stopped successfully!${NC}\n"

# Check if any services are still running
if pgrep -f "manage.py runserver|uvicorn.*main:app|vite" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Warning: Some processes may still be running${NC}"
    echo -e "${CYAN}Run: ps aux | grep -E 'manage.py|uvicorn|vite'${NC}\n"
else
    echo -e "${GREEN}✅ No services are running${NC}\n"
fi
