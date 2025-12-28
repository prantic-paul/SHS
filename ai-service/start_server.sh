#!/bin/bash
cd /home/prantic/SHS/ai-service
exec /home/prantic/SHS/ai-service/venv/bin/python3 -m uvicorn main:app --host 0.0.0.0 --port 8001
