@echo off
TITLE Teacher Dashboard - Simple Start
color 0A

echo ============================================
echo    TEACHER DASHBOARD - SIMPLE START
echo ============================================
echo.
echo This will start your Teacher Dashboard.
echo.
echo Press ANY KEY to begin...
pause > nul

:: Go to project folder
cd /d C:\Users\Ezedi\Student-M-S\Student-M-S

echo.
echo Starting Laravel Server...
echo (A new window will open - KEEP IT OPEN)
echo.

:: Start Laravel in a new window
start "LARAVEL - Keep This Open!" cmd /k "cd /d C:\Users\Ezedi\Student-M-S\Student-M-S && php artisan serve"

:: Wait
timeout /t 7 /nobreak

echo.
echo Starting Frontend Server...
echo (Another window will open - KEEP IT OPEN)
echo.

:: Start Vite in a new window
start "VITE - Keep This Open!" cmd /k "cd /d C:\Users\Ezedi\Student-M-S\Student-M-S && npm run dev"

:: Wait
timeout /t 7 /nobreak

echo.
echo Opening your browser...
echo.

start http://localhost:8000/teacher/dashboard

echo.
echo ============================================
echo DONE!
echo ============================================
echo.
echo If you see errors:
echo 1. Make sure BOTH new windows are still open
echo 2. Look at what they say
echo 3. Send me a screenshot of any errors
echo.
echo Press ANY KEY to close this window...
pause > nul
