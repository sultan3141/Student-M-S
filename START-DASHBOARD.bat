@echo off
color 0A
title Teacher Dashboard - Starting Servers

echo.
echo ========================================
echo   TEACHER DASHBOARD - AUTO START
echo ========================================
echo.

:: Change to project directory
cd /d "C:\Users\Ezedi\Student-M-S\Student-M-S"

echo [1] Checking if PHP is available...
C:\xampp\php\php.exe -v > nul 2>&1
if errorlevel 1 (
    echo ERROR: PHP not found at C:\xampp\php\php.exe
    echo Please make sure XAMPP is installed correctly.
    pause
    exit /b 1
)
echo     PHP is OK!

echo.
echo [2] Starting Laravel Backend Server...
echo     This window will stay open - DO NOT CLOSE IT
echo.
start "Laravel Backend" cmd /k "cd /d C:\Users\Ezedi\Student-M-S\Student-M-S && C:\xampp\php\php.exe artisan serve && echo. && echo Laravel Server is Running! && pause"

:: Wait 5 seconds for Laravel to start
timeout /t 5 /nobreak > nul

echo [3] Starting Vite Frontend Server...
echo     Another window will open - DO NOT CLOSE IT
echo.
start "Vite Frontend" cmd /k "cd /d C:\Users\Ezedi\Student-M-S\Student-M-S && npm run dev && pause"

:: Wait 5 seconds for Vite to start
timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo   SERVERS STARTING!
echo ========================================
echo.
echo Two windows should now be open:
echo   1. Laravel Backend (port 8000)
echo   2. Vite Frontend (port 5173)
echo.
echo Press ANY KEY to open the dashboard in your browser...
pause > nul

echo Opening dashboard...
start http://localhost:8000/teacher/dashboard

echo.
echo ========================================
echo DONE! Check your browser.
echo.
echo If the page doesn't load, check that:
echo  - Both server windows are still open
echo  - You see "Laravel development server started"
echo  - You see "VITE ready"
echo ========================================
echo.
echo Press any key to exit this window...
pause > nul
