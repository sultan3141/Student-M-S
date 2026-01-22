@echo off
TITLE Fix Admin User - Assign Role
color 0E

echo ==================================================
echo   FIXING ADMIN USER ROLE
echo ==================================================
echo.

cd /d C:\Users\Ezedi\Student-M-S\Student-M-S

echo [1] Clearing all caches...
call php artisan optimize:clear

echo.
echo [2] Assigning admin role to user 'admin'...
call php artisan tinker --execute="$user = App\Models\User::where('username', 'admin')->first(); if($user) { $user->syncRoles(['admin']); echo 'Admin role assigned!'; } else { echo 'User not found!'; }"

echo.
echo [3] Cache routes...
call php artisan route:cache

echo.
echo ==================================================
echo   DONE! Try logging in again.
echo ==================================================
echo.
pause
