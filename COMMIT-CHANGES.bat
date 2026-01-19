@echo off
echo ====================================
echo COMMITTING CHANGES ONE BY ONE
echo ====================================
echo.

echo [1/10] Committing: Assessment table migration...
git add database/migrations/2026_01_18_200000_create_assessments_table.php
git commit -m "feat: create assessments table migration"
echo.

echo [2/10] Committing: Assessment ID to marks table...
git add database/migrations/2026_01_18_200001_add_assessment_id_to_marks_table.php
git commit -m "feat: add assessment_id to marks table"
echo.

echo [3/10] Committing: Assessment model...
git add app/Models/Assessment.php
git commit -m "feat: create Assessment model with relationships"
echo.

echo [4/10] Committing: Mark model updates...
git add app/Models/Mark.php
git commit -m "refactor: update Mark model for assessment integration"
echo.

echo [5/10] Committing: TeacherAssessmentController...
git add app/Http/Controllers/TeacherAssessmentController.php
git commit -m "feat: create TeacherAssessmentController for assessment management"
echo.

echo [6/10] Committing: TeacherMarkController updates...
git add app/Http/Controllers/TeacherMarkController.php
git commit -m "refactor: update TeacherMarkController for assessment-based workflow"
echo.

echo [7/10] Committing: Routes update...
git add routes/web.php
git commit -m "feat: add assessment management routes"
echo.

echo [8/10] Committing: Assessment Setup UI...
git add resources/js/Pages/Teacher/Assessments/Index.jsx
git commit -m "feat: create modern Assessment Setup interface"
echo.

echo [9/10] Committing: Mark Entry UI update...
git add resources/js/Pages/Teacher/Marks/Entry.jsx
git commit -m "refactor: update Mark Entry interface for assessment-based flow"
echo.

echo [10/10] Committing: Login page redesign...
git add resources/js/Pages/Auth/UnifiedLogin.jsx
git commit -m "feat: redesign login page with Haramaya University theme"
echo.

echo [11/12] Committing: Dashboard fixes...
git add resources/js/Pages/Teacher/Dashboard.jsx
git commit -m "fix: wire up dashboard Quick Actions buttons"
echo.

echo [12/12] Committing: TeacherAssessmentController syntax fix...
git add app/Http/Controllers/TeacherAssessmentController.php
git commit -m "fix: correct typo in TeacherAssessmentController update method"
echo.

echo ====================================
echo PUSHING ALL COMMITS TO GITHUB
echo ====================================
git push
echo.

echo ====================================
echo DONE! Check your GitHub contribution graph!
echo ====================================
pause
