# 🚀 Quick Start Scripts

This directory contains convenience scripts to quickly start and stop all SHS services.

---

## 📋 Available Scripts

### 1. `start-all.sh` - Start All Services
Starts all three services (Backend, AI Service, Frontend) with one command.

**Usage:**
```bash
./start-all.sh
```

**What it does:**
- ✅ Checks all prerequisites (Python, Node.js, npm)
- ✅ Starts Django backend on `http://localhost:8000`
- ✅ Starts FastAPI AI service on `http://localhost:8001`
- ✅ Starts React + Vite frontend on `http://localhost:5174`
- ✅ Creates log files in `logs/` directory
- ✅ Tracks PIDs for easy shutdown
- ✅ Displays service status and URLs

**Features:**
- Automatic virtual environment activation
- Database migration check
- Dependency installation (if needed)
- Color-coded output
- Real-time service status
- Graceful shutdown with Ctrl+C

---

### 2. `stop-all.sh` - Stop All Services
Stops all running services safely.

**Usage:**
```bash
./stop-all.sh
```

**What it does:**
- ✅ Stops all tracked processes
- ✅ Cleans up any remaining service processes
- ✅ Verifies all services are stopped

---

## 🎯 Quick Start Guide

### First Time Setup

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd SHS
   ```

2. **Make sure you're on the right branch**
   ```bash
   git checkout feature/doctor-recommendation
   ```

3. **Run the start script**
   ```bash
   ./start-all.sh
   ```

4. **Open your browser**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:8000/api/v1/
   - AI Service Docs: http://localhost:8001/docs

### Daily Development Workflow

```bash
# Start all services
./start-all.sh

# Do your development work...

# Stop all services when done
./stop-all.sh
```

---

## 📊 Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5174 | React + Vite Dev Server |
| **Backend API** | http://localhost:8000/api/v1/ | Django REST API |
| **Backend Admin** | http://localhost:8000/admin/ | Django Admin Panel |
| **AI Service** | http://localhost:8001 | FastAPI Service |
| **AI Service Docs** | http://localhost:8001/docs | Interactive API Docs |
| **AI Service Health** | http://localhost:8001/health | Health Check |

---

## 📝 Log Files

All service logs are stored in the `logs/` directory:

- `logs/backend.log` - Django backend logs
- `logs/ai-service.log` - FastAPI AI service logs
- `logs/frontend.log` - React + Vite frontend logs

**View logs in real-time:**
```bash
# Backend logs
tail -f logs/backend.log

# AI service logs
tail -f logs/ai-service.log

# Frontend logs
tail -f logs/frontend.log

# All logs together
tail -f logs/*.log
```

---

## 🛠️ Manual Service Management

If you prefer to start services individually:

### Backend (Django)
```bash
cd backend
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

### AI Service (FastAPI)
```bash
cd ai-service
source venv/bin/activate
python3 -m uvicorn main:app --host 0.0.0.0 --port 8001
```

### Frontend (React + Vite)
```bash
cd frontend
npm run dev
```

---

## 🔧 Troubleshooting

### Services won't start

1. **Check if ports are already in use:**
   ```bash
   # Check port 8000 (Backend)
   lsof -i :8000
   
   # Check port 8001 (AI Service)
   lsof -i :8001
   
   # Check port 5174 (Frontend)
   lsof -i :5174
   ```

2. **Kill existing processes:**
   ```bash
   ./stop-all.sh
   ```

3. **Check prerequisites:**
   ```bash
   python3 --version  # Should be 3.8+
   node --version     # Should be 16+
   npm --version
   ```

### Virtual environment issues

```bash
# Backend
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# AI Service
cd ai-service
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend dependency issues

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Database migration errors

```bash
cd backend
source venv/bin/activate
python manage.py makemigrations
python manage.py migrate
```

---

## 🎨 Script Features

### Color-Coded Output
- 🟢 **Green** - Success messages
- 🔴 **Red** - Error messages
- 🟡 **Yellow** - Warning messages
- 🔵 **Cyan** - Information messages

### Process Management
- Tracks all process IDs in `.service-pids` file
- Graceful shutdown with Ctrl+C
- Automatic cleanup of orphaned processes

### Smart Checks
- Prerequisites verification
- Virtual environment detection
- Database migration status
- Dependency installation status

---

## 📦 Directory Structure

```
SHS/
├── start-all.sh           # Start all services
├── stop-all.sh            # Stop all services
├── logs/                  # Service logs
│   ├── backend.log
│   ├── ai-service.log
│   └── frontend.log
├── backend/               # Django backend
├── ai-service/            # FastAPI AI service
├── frontend/              # React frontend
└── docs/                  # Documentation
```

---

## 🚨 Important Notes

1. **AI Service .env file**: Make sure `ai-service/.env` exists with proper configuration
2. **Database**: PostgreSQL should be running for Django backend
3. **First run**: Initial startup may take longer due to dependency installation
4. **Logs**: Check log files if services fail to start
5. **Ports**: Ensure ports 8000, 8001, and 5174 are available

---

## 🎯 For Development

### Feature Branch Development

You're currently on `feature/doctor-recommendation` branch. When developing:

1. **Start services:**
   ```bash
   ./start-all.sh
   ```

2. **Make your changes** in frontend/backend

3. **Test your changes** in the browser

4. **Stop services:**
   ```bash
   ./stop-all.sh
   ```

5. **Commit your work:**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/doctor-recommendation
   ```

---

## 📞 Need Help?

If you encounter any issues:

1. Check the log files in `logs/` directory
2. Run `./stop-all.sh` and try again
3. Verify all prerequisites are installed
4. Check the troubleshooting section above

---

**Happy Coding! 🚀**
