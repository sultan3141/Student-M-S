@echo off
echo ========================================
echo Performance Optimization Script
echo ========================================
echo.

echo [1/6] Clearing all caches...
C:\php\php.exe artisan cache:clear
C:\php\php.exe artisan config:clear
C:\php\php.exe artisan route:clear
C:\php\php.exe artisan view:clear
echo.

echo [2/6] Optimizing configuration...
C:\php\php.exe artisan config:cache
echo.

echo [3/6] Optimizing routes...
C:\php\php.exe artisan route:cache
echo.

echo [4/6] Optimizing views...
C:\php\php.exe artisan view:cache
echo.

echo [5/6] Optimizing autoloader...
C:\php\php.exe artisan optimize
echo.

echo [6/6] Warming up caches...
C:\php\php.exe artisan cache:warm-student
C:\php\php.exe artisan cache:warm-parent
C:\php\php.exe artisan cache:warm-director
echo.

echo ========================================
echo Performance optimization complete!
echo ========================================
pause
