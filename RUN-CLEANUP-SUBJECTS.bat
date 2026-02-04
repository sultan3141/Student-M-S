@echo off
echo ========================================
echo  Cleanup Duplicate Subjects
echo ========================================
echo.
echo This will remove duplicate subjects from the database
echo (MTH101, PHY101, CHM101, BIO101, ENG101, AMH101, CIV101)
echo.
pause
echo.

REM Try to run PHP script
php cleanup_subjects.php

echo.
echo ========================================
echo  Cleanup Complete
echo ========================================
echo.
pause
