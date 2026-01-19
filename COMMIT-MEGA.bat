@echo off
echo Starting 30+ Point Mega Commit...

:: Models (4 Commits)
git add app/Models/Announcement.php
git commit -m "Model: Create Announcement entity"

git add app/Models/RegistrationPeriod.php
git commit -m "Model: Create RegistrationPeriod entity"

git add app/Models/DocumentTemplate.php
git commit -m "Model: Create DocumentTemplate entity"

git add app/Models/User.php
git commit -m "Model: Update User with profile photo support"

:: Database Migrations (4 Commits)
git add "database/migrations/*announcements_table.php"
git commit -m "DB: Create announcements schema"

git add "database/migrations/*registration_periods_table.php"
git commit -m "DB: Create registration periods schema"

git add "database/migrations/*document_templates_table.php"
git commit -m "DB: Create document templates schema"

git add "database/migrations/*add_profile_photo_to_users_table.php"
git commit -m "DB: Add profile photo column to users"

:: Controllers (7 Commits)
git add app/Http/Controllers/DirectorDashboardController.php
git commit -m "Controller: Implement Director Dashboard logic"

git add app/Http/Controllers/DirectorTeacherController.php
git commit -m "Controller: Implement Teacher management logic"

git add app/Http/Controllers/DirectorAcademicController.php
git commit -m "Controller: Implement Academic Analytics logic"

git add app/Http/Controllers/DirectorRegistrationController.php
git commit -m "Controller: Implement Registration flow logic"

git add app/Http/Controllers/DirectorCommunicationController.php
git commit -m "Controller: Implement Communication/Announcements logic"

git add app/Http/Controllers/DirectorStudentStatisticsController.php
git commit -m "Controller: Implement Student Statistics logic"

git add app/Http/Controllers/DirectorProfileController.php
git commit -m "Controller: Implement Profile management logic"

:: Auth & Config (2 Commits)
git add app/Http/Controllers/Auth/UnifiedLoginController.php
git commit -m "Auth: Update login redirect for Director role"

git add bootstrap/app.php
git commit -m "Config: Register role-based middleware aliases"

:: Frontend - Views (10 Commits)
git add resources/js/Pages/Director/Dashboard.jsx
git commit -m "View: Create Executive Dashboard UI"

git add resources/js/Pages/Director/Teachers/Index.jsx
git commit -m "View: Create Teachers List UI"

git add resources/js/Pages/Director/Teachers/Create.jsx
git commit -m "View: Create Teacher Registration Form"

git add resources/js/Pages/Director/Teachers/Edit.jsx
git commit -m "View: Create Teacher Edit Form"

git add resources/js/Pages/Director/Teachers/Show.jsx
git commit -m "View: Create Teacher Profile View"

git add resources/js/Pages/Director/Academic/Overview.jsx
git commit -m "View: Create Academic Command Center UI"

git add resources/js/Pages/Director/Registration/Status.jsx
git commit -m "View: Create Registration Status UI"

git add resources/js/Pages/Director/Communication/Index.jsx
git commit -m "View: Create Communication Center UI"

git add resources/js/Pages/Director/Statistics/Students.jsx
git commit -m "View: Create Student Statistics Charts"

git add resources/js/Pages/Director/Profile.jsx
git commit -m "View: Create Director Profile Settings UI"

:: Frontend - Layouts & Styles (2 Commits)
git add resources/js/Layouts/DirectorLayout.jsx
git commit -m "Layout: Implement Premium Navy/Gold Director Sidebar"

git add resources/css/director-theme.css
git commit -m "Style: Define Executive Theme Variables and Utilities"

:: Routes (1 Commit)
git add routes/web.php
git commit -m "Route: Define comprehensive Director route groups"

:: Utilities (1 Commit)
git add FIX-ROUTES.bat
git commit -m "Util: Add route cache fixing script"

echo.
echo ✅ MEGA COMMIT COMPLETE! 31 Changes Committed.
pause
