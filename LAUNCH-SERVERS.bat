@echo off
SETLOCAL EnableDelayedExpansion
color 0A
title Teacher Dashboard - Server Launcher

:: ==================================================
:: TEACHER DASHBOARD - RELIABLE SERVER LAUNCHER
:: ==================================================

echo.
echo ================================================
echo   TEACHER DASHBOARD - SERVER LAUNCHER
echo ================================================
echo.
echo This script will start both servers for you.
echo.

:: Navigate to project directory
cd /d "%~dp0"
echo [*] Project Directory: %cd%
echo.

:: ==================================================
:: STEP 1: Check PHP
:: ==================================================
echo [1/4] Checking PHP installation...

:: Try XAMPP PHP first
set "PHP_PATH=C:\xampp\php\php.exe"
if exist "%PHP_PATH%" (
    echo     [OK] Found PHP at XAMPP
    goto :php_found
)

:: Try system PHP
php -v >nul 2>&1
if !errorlevel! equ 0 (
    set "PHP_PATH=php"
    echo     [OK] Found PHP in system PATH
    goto :php_found
)

:: PHP not found
echo     [ERROR] PHP not found!
echo.
echo     Please install XAMPP or add PHP to your PATH
echo     Download XAMPP: https://www.apachefriends.org/
echo.
pause
exit /b 1

:php_found
echo.

:: ==================================================
:: STEP 2: Check Node.js
:: ==================================================
echo [2/4] Checking Node.js installation...

node -v >nul 2>&1
if !errorlevel! neq 0 (
    echo     [ERROR] Node.js not found!
    echo.
    echo     Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo     [OK] Node.js is installed
echo.

:: ==================================================
:: STEP 3: Start Laravel Backend
:: ==================================================
echo [3/4] Starting Laravel Backend Server...
echo     Opening new window for Laravel...
echo     [IMPORTANT] Keep the Laravel window open!
echo.

start "Laravel Backend - PORT 8000" cmd /k "echo Laravel Backend Server && echo ======================= && cd /d "%cd%" && "%PHP_PATH%" artisan serve && pause"

:: Wait for Laravel to initialize
echo     Waiting for Laravel to start...
timeout /t 8 /nobreak > nul

echo     [OK] Laravel window opened
echo.

:: ==================================================
:: STEP 4: Start Vite Frontend
:: ==================================================
echo [4/4] Starting Vite Frontend Server...
echo     Opening new window for Vite...
echo     [IMPORTANT] Keep the Vite window open!
echo.

start "Vite Frontend - PORT 5173" cmd /k "echo Vite Frontend Server && echo ======================= && cd /d "%cd%" && npm run dev && pause"

:: Wait for Vite to initialize
echo     Waiting for Vite to start...
timeout /t 8 /nobreak > nul

echo     [OK] Vite window opened
echo.

:: ==================================================
:: COMPLETION
:: ==================================================
echo ================================================
echo   SERVERS ARE STARTING!
echo ================================================
echo.
echo You should now see TWO windows:
echo   1. Laravel Backend (Port 8000)
echo   2. Vite Frontend (Port 5173)
echo.
echo Check those windows for any errors.
echo.
echo ------------------------------------------------
echo.
echo Press ANY KEY to open the dashboard in browser...
pause > nul

echo Opening browser...
start http://localhost:8000/teacher/dashboard

echo.
echo ================================================
echo   DASHBOARD OPENED!
echo ================================================
echo.
echo If the page doesn't load:
echo   1. Check both server windows are still open
echo   2. Look for error messages in those windows
echo   3. Make sure you see:
echo      - "Laravel development server started"
echo      - "VITE ready"
echo.
echo To stop the servers:
echo   - Close both server windows
echo   - Or press Ctrl+C in each window
echo.
echo Press ANY KEY to close this launcher...
pause > nul
