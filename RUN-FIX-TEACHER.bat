@echo off
echo ========================================
echo   Fixing Teacher Profile Issue
echo ========================================
echo.
echo This will create missing teacher profiles...
echo.

.\composer.bat run-script post-autoload-dump

echo.
echo Running fix script...
echo.

.\composer.bat exec -- php fix_teacher_now.php

echo.
echo ========================================
echo   Fix Complete!
echo ========================================
echo.
echo You can now:
echo 1. Refresh your browser
echo 2. Click "Create Assessment" again
echo 3. You should see the class selection page
echo.
pause
