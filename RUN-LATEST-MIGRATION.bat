@echo off
echo ============================================
echo    RUNNING DATABASE MIGRATION
echo ============================================
echo.

C:\php\php.exe -c php.ini artisan migrate

echo.
echo ============================================
echo MIGRATION COMPLETE!
echo ============================================
echo.
pause
