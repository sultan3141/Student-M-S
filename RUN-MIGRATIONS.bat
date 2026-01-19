@echo off
TITLE Apply Database Changes
color 0B

echo ====================================
echo APPLYING DATABASE MIGRATIONS
echo ====================================
echo.

echo This will create the new 'assessments' table
echo required for the modern mark interface.
echo.
pause

echo Running migrations...
C:\xampp\php\php.exe artisan migrate

echo.
echo ====================================
echo DONE! Database is updated.
echo ====================================
echo.
echo You can now use the new Assessment features!
echo.
pause
