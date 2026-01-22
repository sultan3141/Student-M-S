@echo off
TITLE Git Commit and Push - Student Management System (ezedin56)
color 0B

echo ==================================================
echo   COMMITTING CHANGES FOR EZEDIN56
echo ==================================================
echo.

cd /d C:\Users\Ezedi\Student-M-S\Student-M-S

echo [Setting Identity]
git config user.name "ezedin56"
REM Only set email if you want to override global default, otherwise skip
REM git config user.email "your-email@example.com"

echo.
echo ==================================================
echo   STEP 1: SERVER SCRIPTS
echo ==================================================
git add LAUNCH-SERVERS.bat CLEAN-AND-START.bat TRY-DIFFERENT-PORT.bat SETUP-DATABASE.bat .vscode/tasks.json QUICK-START.md
git commit -m "feat(devops): Add server automation scripts for easy startup (by ezedin56)"
echo. & echo [Step 1 Done] & echo.

echo ==================================================
echo   STEP 2: BACKEND AUTHENTICATION
echo ==================================================
git add app/Http/Controllers/Auth/UnifiedLoginController.php routes/auth.php routes/web.php app/Http/Requests/Auth/LoginRequest.php
git commit -m "feat(auth): Implement unified login controller and backend routing logic (by ezedin56)"
echo. & echo [Step 2 Done] & echo.

echo ==================================================
echo   STEP 3: DATABASE & USERNAME MIGRATION
echo ==================================================
git add database/migrations/*_add_username_to_users_table.php app/Models/User.php database/seeders/UserSeeder.php database/seeders/DatabaseSeeder.php config/auth.php
git commit -m "feat(db): Convert authentication to username-based system (by ezedin56)"
echo. & echo [Step 3 Done] & echo.

echo ==================================================
echo   STEP 4: UI COMPONENTS (GLASSMORPHISM)
echo ==================================================
git add resources/js/Components/Auth/AnimatedBackground.jsx resources/js/Components/Auth/GlassCard.jsx resources/js/Components/Auth/RoleBadge.jsx
git commit -m "feat(ui): Add Glassmorphism components and animated backgrounds (by ezedin56)"
echo. & echo [Step 4 Done] & echo.

echo ==================================================
echo   STEP 5: FRONTEND PAGES
echo ==================================================
git add resources/js/Pages/Auth/UnifiedLogin.jsx resources/js/Pages/Admin/Dashboard.jsx resources/js/Pages/Parent/Dashboard.jsx
git commit -m "feat(pages): Create new Login Page and Role Dashboards (by ezedin56)"
echo. & echo [Step 5 Done] & echo.

echo ==================================================
echo   STEP 6: DOCUMENTATION
echo ==================================================
git add *.md
git commit -m "collab: Add implementation guides and walkthroughs (by ezedin56)"
echo. & echo [Step 6 Done] & echo.

echo ==================================================
echo   STEP 7: TEACHER DASHBOARD REFINEMENT
echo ==================================================
git add resources/js/Pages/Teacher/Dashboard.jsx resources/js/Layouts/TeacherLayout.jsx app/Http/Controllers/TeacherDashboardController.php
git commit -m "feat(teacher): Finalize teacher dashboard design and sidebar navigation (by ezedin56)"
echo. & echo [Step 7 Done] & echo.

echo ==================================================
echo   STEP 8: STUDENT & ADMIN DASHBOARD UPGRADE
echo ==================================================
git add resources/js/Layouts/StudentLayout.jsx resources/js/Pages/Student/Dashboard.jsx
git add resources/js/Layouts/AdminLayout.jsx resources/js/Pages/Admin/Dashboard.jsx
git commit -m "feat(ui): Upgrade Student and Admin dashboards to premium glassmorphism layouts (by ezedin56)"
echo. & echo [Step 8 Done] & echo.

echo ==================================================
echo   STEP 9: PARENT DASHBOARD & REGISTRATION FIX
echo ==================================================
git add resources/js/Layouts/ParentLayout.jsx resources/js/Pages/Parent/Dashboard.jsx
git add resources/js/Pages/Auth/Register.jsx
git commit -m "feat(ui): Complete 4-role dashboard suite (Parent) and switch registration to username (by ezedin56)"
echo. & echo [Step 9 Done] & echo.

echo ==================================================
echo   PUSHING TO GITHUB (ezedin56)
echo ==================================================
git push origin main

echo.
echo ==================================================
echo   SUCCESS! ALL COMMITS PUSHED.
echo ==================================================
echo.
pause
