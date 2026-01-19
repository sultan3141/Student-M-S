@echo off
echo ========================================
echo Starting Teacher Dashboard Servers
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Laravel Backend...
echo.
start "Laravel Server" cmd /k "php artisan serve"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Vite Frontend...
echo.
start "Vite Dev Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Laravel: http://localhost:8000
echo Vite: Will show in new window
echo.
echo Press any key to open the dashboard in your browser...
pause > nul

start http://localhost:8000/teacher/dashboard

echo.
echo All done! Check the new windows.
echo You can close this window now.
