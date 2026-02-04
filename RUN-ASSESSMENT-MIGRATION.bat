@echo off
echo ============================================
echo    RUNNING ASSESSMENT DATABASE MIGRATION
echo ============================================
echo.
echo This will make assessment_type_id nullable in assessments table
echo.

C:\xampp\php\php.exe artisan migrate

echo.
echo ============================================
echo MIGRATION COMPLETE!
echo ============================================
echo.
echo You can now create assessments without assessment types.
echo.
pause
