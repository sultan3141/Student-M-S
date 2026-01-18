@echo off
color 0E
title Teacher Dashboard - DIFFERENT PORTS

echo.
echo ==================================================
echo   TRYING DIFFERENT PORTS (8080 & 5174)
echo ==================================================
echo.

cd /d C:\Users\Ezedi\Student-M-S\Student-M-S

echo [1] Starting Laravel on port 8080...
start "Laravel (8080)" cmd /k "C:\xampp\php\php.exe artisan serve --port=8080"

echo.
echo [2] Starting Vite...
start "Vite Server" cmd /k "npm run dev"

echo.
echo [3] Waiting 10 seconds...
timeout /t 10

echo.
echo [4] Opening Browser...
start http://localhost:8080/teacher/dashboard

echo.
echo ==================================================
echo   CHECK YOUR BROWSER NOW!
echo ==================================================
echo.
pause
