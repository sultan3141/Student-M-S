@echo off
echo Starting Granular Commits...

git add app/Http/Controllers/DirectorDashboardController.php
git commit -m "Feat: Update DirectorDashboard logic for statistics integration"

git add resources/js/Pages/Director/Dashboard.jsx
git commit -m "UI: Redesign Director Dashboard with combined statistics widgets"

git add resources/js/Layouts/DirectorLayout.jsx
git commit -m "Layout: Remove top header and consolidate sidebar navigation"

git add resources/css/director-theme.css
git commit -m "Style: Update director theme variables"

git add database/migrations/2026_01_19_180000_add_profile_photo_to_users_table.php
git commit -m "DB: Add migration for user profile photo path"

git add app/Models/User.php
git commit -m "Model: Add profile_photo_path to User fillable"

git add app/Http/Controllers/DirectorProfileController.php
git commit -m "Feat: Create DirectorProfileController for profile management"

git add resources/js/Pages/Director/Profile.jsx
git commit -m "UI: Implement premium Director Profile page"

git add routes/web.php
git commit -m "Route: Register Director Profile and adjust permission groups"

git add app/Http/Controllers/DirectorAcademicController.php
git commit -m "Refactor: Convert Academic Controller to Inertia response"

git add resources/js/Pages/Director/Academic/Overview.jsx
git commit -m "Perf: Optimize Academic Overview with server-side props"

git add FIX-ROUTES.bat
git commit -m "Chore: Add route cache fixing script"

echo.
echo ✅ All Step-by-Step Commits Completed!
pause
