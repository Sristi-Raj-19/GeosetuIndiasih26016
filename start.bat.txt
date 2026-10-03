@echo off
title GeoSetu-India Platform Launcher (Node.js + Express + Supabase)
echo ==========================================================
echo  GeoSetu-India (National Land Acquisition & Management)
echo  Launching Node.js + Express Backend with Supabase Integration...
echo ==========================================================
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies...
  call npm install
)
start "GeoSetu-India Server" cmd /k "node server/index.js"
timeout /t 2 /nobreak >nul
start http://localhost:8080
echo GeoSetu-India is now live at http://localhost:8080
echo Backend API available at http://localhost:8080/api/health
echo Keep the server console window open while using the platform.

