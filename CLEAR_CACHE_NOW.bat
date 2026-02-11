@echo off
echo ========================================
echo CLEARING ALL CACHES - TEACHER DASHBOARD FIX
echo ========================================
echo.

cd Student-M-S

echo Step 1: Clearing Laravel caches...
php artisan optimize:clear
echo.

echo Step 2: Clearing route cache...
php artisan route:clear
echo.

echo Step 3: Clearing config cache...
php artisan config:clear
echo.

echo Step 4: Clearing view cache...
php artisan view:clear
echo.

echo ========================================
echo SERVER CACHES CLEARED!
echo ========================================
echo.
echo NOW YOU MUST CLEAR BROWSER CACHE:
echo.
echo 1. CLOSE THIS WINDOW
echo 2. CLOSE ALL BROWSER WINDOWS
echo 3. REOPEN BROWSER
echo 4. Press Ctrl + Shift + Delete
echo 5. Select "All time"
echo 6. Check "Cached images and files"
echo 7. Click "Clear data"
echo 8. CLOSE BROWSER AGAIN
echo 9. REOPEN and try http://localhost:8000
echo.
echo OR TRY INCOGNITO MODE:
echo Press Ctrl + Shift + N and visit http://localhost:8000
echo.
pause
