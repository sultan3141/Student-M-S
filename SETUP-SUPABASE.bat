@echo off
TITLE Setup Supabase Database
color 0A

echo ============================================
echo    SUPABASE DATABASE SETUP
echo ============================================
echo.
echo This will:
echo 1. Clear config cache
echo 2. Test database connection
echo 3. Run migrations
echo 4. Seed the database
echo.
echo Press ANY KEY to begin...
pause > nul

cd /d C:\Users\Ezedi\Student-M-S\Student-M-S

echo.
echo [1/4] Clearing config cache...
C:\xampp\php\php.exe artisan config:clear
if %errorlevel% neq 0 (
    echo ERROR: Failed to clear config
    pause
    exit /b 1
)

echo.
echo [2/4] Testing database connection...
C:\xampp\php\php.exe artisan db:show
if %errorlevel% neq 0 (
    echo ERROR: Cannot connect to Supabase
    echo Check your .env file settings
    pause
    exit /b 1
)

echo.
echo [3/4] Running migrations (fresh)...
C:\xampp\php\php.exe artisan migrate:fresh
if %errorlevel% neq 0 (
    echo ERROR: Migration failed
    pause
    exit /b 1
)

echo.
echo [4/4] Seeding database...
C:\xampp\php\php.exe artisan db:seed
if %errorlevel% neq 0 (
    echo ERROR: Seeding failed
    pause
    exit /b 1
)

echo.
echo ============================================
echo SUCCESS! Database is ready!
echo ============================================
echo.
echo You can now start your application.
echo.
pause
