@echo off
echo ============================================
echo    RUNNING DATABASE MIGRATION
echo ============================================
echo.
echo This will add the stream_id column to subjects table
echo.

php artisan migrate

echo.
echo ============================================
echo MIGRATION COMPLETE!
echo ============================================
echo.
echo You can now create subjects with streams.
echo.
pause
