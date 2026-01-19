@echo off
echo Synchronizing with GitHub...

:: 1. Pull remote changes first
echo Pulling latest changes...
git pull origin main

:: Check for errors/conflicts
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  ERROR: Could not pull changes automatically.
    echo You may have merge conflicts. Please look at the error message above.
    pause
    exit /b
)

:: 2. Push local changes
echo.
echo Pushing your work...
git push origin main

echo.
echo ✅ Sync & Push Complete!
pause
