@echo off
echo ========================================
echo   Laravel Server with SQLite Support
echo ========================================
echo.
echo Testing SQLite connection...
C:\php\php.exe -d extension=pdo_sqlite test-sqlite.php
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] SQLite test failed!
    pause
    exit /b 1
)
echo.
echo ========================================
echo Starting server on http://127.0.0.1:8000
echo Press Ctrl+C to stop the server
echo ========================================
echo.
C:\php\php.exe -d extension=pdo_sqlite -S 127.0.0.1:8000 -t public
pause