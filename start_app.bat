@echo off
echo Starting Student Management System...
echo -------------------------------------
echo Step 1: Starting Laravel Server (port 8000)...
start "Laravel Server" php artisan serve

echo Step 2: Starting Vite Asset Server...
start "Vite Server" npm run dev

echo -------------------------------------
echo Servers launched in background windows.
echo Access the Dashboard here: http://127.0.0.1:8000/registrar/dashboard
pause
