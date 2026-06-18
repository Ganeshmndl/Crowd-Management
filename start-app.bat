@echo off
title CrowdCare Launcher
cd /d "%~dp0"

echo Starting CrowdCare Backend...
start /B "CrowdCare Backend" cmd /c "cd backend && npm run dev"

echo Starting CrowdCare Frontend...
echo.
echo Opening browser at http://localhost:5173...
start "" "http://localhost:5173"
cd frontend
call npm run dev

