@echo off
TITLE Student Management System - FRESH START
color 0B

echo ==================================================
echo   STOPPING OLD SERVERS (CLEANUP)
echo ==================================================
echo.
echo [1/3] Killing old PHP processes...
taskkill /F /IM php.exe >nul 2>&1
echo       Done.

echo.
echo [2/3] Killing old Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
echo       Done.

echo.
echo ==================================================
echo   STARTING NEW SERVERS
echo ==================================================
echo.

<<<<<<< HEAD
cd /d %~dp0
=======
cd /d C:\Users\Ezedi\Student-M-S\Student-M-S
>>>>>>> c3c2e32 (Final sync: Integrated all premium Teacher/Parent portal components and configurations)

echo [1] Starting Laravel Backend (8000)...
start "Laravel Server" cmd /k "C:\xampp\php\php.exe artisan serve"

echo.
echo [2] Starting Vite Frontend...
start "Vite Server" cmd /k "npm run dev"

echo.
echo [3] Waiting for servers to warm up (10s)...
timeout /t 10

echo.
echo [4] Opening Login Page...
start http://localhost:8000/login

echo.
echo ==================================================
echo   DONE! CHECK YOUR BROWSER.
echo ==================================================
echo.
pause
