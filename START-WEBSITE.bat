@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nahi mila. Node.js install karein ya mujhe batayein.
  pause
  exit /b 1
)
start "Portfolio Browser" cmd /c "timeout /t 2 >nul & start http://127.0.0.1:4173"
node server.js
pause
