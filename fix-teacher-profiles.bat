@echo off
echo Creating missing teacher profiles...
echo.

.\composer.bat run-script post-autoload-dump

echo.
echo Running seeder to create teacher profiles...
.\composer.bat exec -- php artisan db:seed --class=CreateMissingTeacherProfiles

echo.
echo Done! Teacher profiles have been created.
echo You can now access the assessment creation page.
pause
