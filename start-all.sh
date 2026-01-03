#!/bin/bash

# ==============================================================================
# SHS (Intelligent Doctor Recommendation System) - All Services Startup Script
# ==============================================================================
# This script starts all three services: Frontend, Backend, and AI Service
# Usage: ./start-all.sh
# ==============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Service directories
BACKEND_DIR="$PROJECT_ROOT/backend"
AI_SERVICE_DIR="$PROJECT_ROOT/ai-service"
DISEASE_SERVICE_DIR="$PROJECT_ROOT/disease-prediction-service"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

# Log files
LOG_DIR="$PROJECT_ROOT/logs"
mkdir -p "$LOG_DIR"
BACKEND_LOG="$LOG_DIR/backend.log"
AI_SERVICE_LOG="$LOG_DIR/ai-service.log"
DISEASE_SERVICE_LOG="$LOG_DIR/disease-prediction.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"

# PID file to track running processes
PID_FILE="$PROJECT_ROOT/.service-pids"

# ==============================================================================
# Helper Functions
# ==============================================================================

print_header() {
    echo -e "\n${BOLD}${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${CYAN}║                                                                ║${NC}"
    echo -e "${BOLD}${CYAN}║         🏥 SHS - Intelligent Doctor Recommendation System      ║${NC}"
    echo -e "${BOLD}${CYAN}║                    All Services Startup Script                 ║${NC}"
    echo -e "${BOLD}${CYAN}║                                                                ║${NC}"
    echo -e "${BOLD}${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}\n"
}

print_section() {
    echo -e "\n${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${BLUE}$1${NC}"
    echo -e "${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# ==============================================================================
# Cleanup Function
# ==============================================================================

cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down all services...${NC}\n"
    
    if [ -f "$PID_FILE" ]; then
        while IFS= read -r pid; do
            if kill -0 "$pid" 2>/dev/null; then
                kill "$pid" 2>/dev/null || true
                print_info "Stopped process $pid"
            fi
        done < "$PID_FILE"
        rm -f "$PID_FILE"
    fi
    
    # Kill any remaining processes
    pkill -f "python.*manage.py runserver" 2>/dev/null || true
    pkill -f "uvicorn.*main:app" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    
    print_success "All services stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

# ==============================================================================
# Check Prerequisites
# ==============================================================================

check_prerequisites() {
    print_section "🔍 Checking Prerequisites"
    
    # Check if directories exist
    if [ ! -d "$BACKEND_DIR" ]; then
        print_error "Backend directory not found: $BACKEND_DIR"
        exit 1
    fi
    
    if [ ! -d "$AI_SERVICE_DIR" ]; then
        print_error "AI Service directory not found: $AI_SERVICE_DIR"
        exit 1
    fi
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        print_error "Frontend directory not found: $FRONTEND_DIR"
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed"
        exit 1
    fi
    print_success "Python 3 found: $(python3 --version)"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    print_success "Node.js found: $(node --version)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm found: $(npm --version)"
    
    print_success "All prerequisites met!"
}

# ==============================================================================
# Start Backend Service (Django)
# ==============================================================================

start_backend() {
    print_section "🚀 Starting Backend Service (Django)"
    
    cd "$BACKEND_DIR"
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        print_warning "Virtual environment not found. Creating one..."
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    else
        source venv/bin/activate
    fi
    
    # Check if database migrations are needed
    print_info "Checking database migrations..."
    python manage.py migrate --check &> /dev/null || {
        print_warning "Running database migrations..."
        python manage.py migrate
    }
    
    print_info "Starting Django server on http://127.0.0.1:8000"
    python manage.py runserver 0.0.0.0:8000 > "$BACKEND_LOG" 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID >> "$PID_FILE"
    
    # Wait a moment and check if it's running
    sleep 2
    if kill -0 $BACKEND_PID 2>/dev/null; then
        print_success "Backend service started (PID: $BACKEND_PID)"
        print_info "Logs: $BACKEND_LOG"
    else
        print_error "Failed to start backend service"
        cat "$BACKEND_LOG"
        exit 1
    fi
    
    cd "$PROJECT_ROOT"
}

# ==============================================================================
# Start AI Service (FastAPI)
# ==============================================================================

start_ai_service() {
    print_section "🤖 Starting AI Service (FastAPI)"
    
    cd "$AI_SERVICE_DIR"
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        print_warning "Virtual environment not found. Creating one..."
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    else
        source venv/bin/activate
    fi
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        print_error ".env file not found in ai-service directory"
        print_warning "Please create .env file with required configurations"
        exit 1
    fi
    
    print_info "Starting FastAPI server on http://127.0.0.1:8001"
    python3 -m uvicorn main:app --host 0.0.0.0 --port 8001 > "$AI_SERVICE_LOG" 2>&1 &
    AI_SERVICE_PID=$!
    echo $AI_SERVICE_PID >> "$PID_FILE"
    
    # Wait a moment and check if it's running
    sleep 3
    if kill -0 $AI_SERVICE_PID 2>/dev/null; then
        print_success "AI service started (PID: $AI_SERVICE_PID)"
        print_info "Logs: $AI_SERVICE_LOG"
    else
        print_error "Failed to start AI service"
        cat "$AI_SERVICE_LOG"
        exit 1
    fi
    
    cd "$PROJECT_ROOT"
}

# ==============================================================================
# Start Disease Prediction Service (FastAPI)
# ==============================================================================

start_disease_service() {
    print_section "🧬 Starting Disease Prediction Service (FastAPI)"
    
    cd "$DISEASE_SERVICE_DIR"
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        print_warning "Virtual environment not found for disease service"
        print_error "Please run: cd disease-prediction-service && python3 -m venv venv && pip install -r requirements.txt"
        exit 1
    else
        source venv/bin/activate
    fi
    
    # Check if model exists
    if [ ! -f "app/data/models/disease_model.pkl" ]; then
        print_warning "Trained model not found"
        print_info "Training model now... (this may take a few minutes)"
        python train_model.py
        if [ $? -ne 0 ]; then
            print_error "Model training failed"
            exit 1
        fi
    fi
    
    print_info "Starting Disease Prediction service on http://127.0.0.1:8002"
    python3 -m uvicorn main:app --host 0.0.0.0 --port 8002 > "$DISEASE_SERVICE_LOG" 2>&1 &
    DISEASE_SERVICE_PID=$!
    echo $DISEASE_SERVICE_PID >> "$PID_FILE"
    
    # Wait a moment and check if it's running
    sleep 3
    if kill -0 $DISEASE_SERVICE_PID 2>/dev/null; then
        print_success "Disease prediction service started (PID: $DISEASE_SERVICE_PID)"
        print_info "Logs: $DISEASE_SERVICE_LOG"
    else
        print_error "Failed to start disease prediction service"
        cat "$DISEASE_SERVICE_LOG"
        exit 1
    fi
    
    cd "$PROJECT_ROOT"
}

# ==============================================================================
# Start Frontend Service (React + Vite)
# ==============================================================================

start_frontend() {
    print_section "⚛️  Starting Frontend Service (React + Vite)"
    
    cd "$FRONTEND_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_warning "node_modules not found. Installing dependencies..."
        npm install
    fi
    
    print_info "Starting Vite dev server on http://127.0.0.1:5174"
    npm run dev > "$FRONTEND_LOG" 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID >> "$PID_FILE"
    
    # Wait a moment and check if it's running
    sleep 3
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        print_success "Frontend service started (PID: $FRONTEND_PID)"
        print_info "Logs: $FRONTEND_LOG"
    else
        print_error "Failed to start frontend service"
        cat "$FRONTEND_LOG"
        exit 1
    fi
    
    cd "$PROJECT_ROOT"
}

# ==============================================================================
# Display Service Status
# ==============================================================================

display_status() {
    print_section "📊 Service Status"
    
    echo -e "${BOLD}Service Overview:${NC}\n"
    
    echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${CYAN}│${NC} ${BOLD}Backend (Django)${NC}                                            ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}   URL:  ${GREEN}http://localhost:8000${NC}                              ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}   API:  ${GREEN}http://localhost:8000/api/v1/${NC}                      ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}   Admin: ${GREEN}http://localhost:8000/admin/${NC}                     ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}   Logs: ${YELLOW}$BACKEND_LOG${NC}"
    echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}\n"
    
    echo -e "${MAGENTA}┌─────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${MAGENTA}│${NC} ${BOLD}AI Service (FastAPI)${NC}                                       ${MAGENTA}│${NC}"
    echo -e "${MAGENTA}│${NC}   URL:  ${GREEN}http://localhost:8001${NC}                              ${MAGENTA}│${NC}"
    echo -e "${MAGENTA}│${NC}   Docs: ${GREEN}http://localhost:8001/docs${NC}                        ${MAGENTA}│${NC}"
    echo -e "${MAGENTA}│${NC}   Health: ${GREEN}http://localhost:8001/health${NC}                   ${MAGENTA}│${NC}"
    echo -e "${MAGENTA}│${NC}   Logs: ${YELLOW}$AI_SERVICE_LOG${NC}"
    echo -e "${MAGENTA}└─────────────────────────────────────────────────────────────┘${NC}\n"
    
    echo -e "${YELLOW}┌─────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${YELLOW}│${NC} ${BOLD}Disease Prediction (FastAPI + ML)${NC}                         ${YELLOW}│${NC}"
    echo -e "${YELLOW}│${NC}   URL:  ${GREEN}http://localhost:8002${NC}                              ${YELLOW}│${NC}"
    echo -e "${YELLOW}│${NC}   Docs: ${GREEN}http://localhost:8002/docs${NC}                        ${YELLOW}│${NC}"
    echo -e "${YELLOW}│${NC}   API:  ${GREEN}http://localhost:8002/api/v1/predict/${NC}            ${YELLOW}│${NC}"
    echo -e "${YELLOW}│${NC}   Logs: ${YELLOW}$DISEASE_SERVICE_LOG${NC}"
    echo -e "${YELLOW}└─────────────────────────────────────────────────────────────┘${NC}\n"
    
    echo -e "${BLUE}┌─────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${BLUE}│${NC} ${BOLD}Frontend (React + Vite)${NC}                                    ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC}   URL:  ${GREEN}http://localhost:5174${NC}                              ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC}   Logs: ${YELLOW}$FRONTEND_LOG${NC}"
    echo -e "${BLUE}└─────────────────────────────────────────────────────────────┘${NC}\n"
}

# ==============================================================================
# Display Help Information
# ==============================================================================

display_help() {
    print_section "📚 Quick Commands"
    
    echo -e "${BOLD}Useful commands:${NC}\n"
    echo -e "  ${CYAN}View backend logs:${NC}     tail -f $BACKEND_LOG"
    echo -e "  ${CYAN}View AI service logs:${NC}  tail -f $AI_SERVICE_LOG"
    echo -e "  ${CYAN}View frontend logs:${NC}    tail -f $FRONTEND_LOG"
    echo -e "  ${CYAN}View all logs:${NC}         tail -f $LOG_DIR/*.log"
    echo -e "\n  ${YELLOW}Stop all services:${NC}     Press Ctrl+C in this terminal"
    echo -e "  ${YELLOW}Or run:${NC}                pkill -f 'python.*manage.py|uvicorn|vite'"
}

# ==============================================================================
# Main Execution
# ==============================================================================

main() {
    # Clear screen
    clear
    
    # Print header
    print_header
    
    # Check prerequisites
    check_prerequisites
    
    # Start services in order
    start_backend
    sleep 2
    
    start_ai_service
    sleep 2
    
    start_disease_service
    sleep 2
    
    start_frontend
    sleep 2
    
    # Display status
    display_status
    
    # Display help
    display_help
    
    # Final message
    print_section "✅ All Services Running"
    
    echo -e "${GREEN}${BOLD}🎉 All services are up and running!${NC}\n"
    echo -e "${CYAN}Open your browser and navigate to:${NC}"
    echo -e "${BOLD}${GREEN}http://localhost:5174${NC}\n"
    
    echo -e "${YELLOW}${BOLD}Press Ctrl+C to stop all services${NC}\n"
    
    # Keep script running
    wait
}

# Run main function
main
