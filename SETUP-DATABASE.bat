@echo off
TITLE Student Management System - Complete Setup
color 0D

echo ================================================
echo   STUDENT MANAGEMENT SYSTEM
echo   Complete Database Setup
echo ================================================
echo.

cd /d C:\Users\Ezedi\Student-M-S\Student-M-S

echo [1/3] Running database migrations...
C:\xampp\php\php.exe artisan migrate --force

echo.
echo [2/3] Seeding database with test users...
C:\xampp\php\php.exe artisan db:seed --force

echo.
echo [3/3] Setup complete!
echo.
echo ================================================
echo   TEST USERS CREATED
echo ================================================
echo.
echo Admin:      username: admin          password: password
echo Registrar:  username: registrar_jane password: password
echo Teacher:    username: teacher_john   password: password
echo Student:    username: student_alice  password: password
echo Parent:     username: parent_mary    password: password
echo.
echo ================================================
echo.
pause
