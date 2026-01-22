@echo off
echo Fixing Routes and Cache...
cd c:\Users\Ezedi\Student-M-S\Student-M-S
php artisan route:clear
php artisan route:cache
php artisan config:clear
php artisan view:clear
echo.
echo Routes Fixed! Please refresh the page.
pause
