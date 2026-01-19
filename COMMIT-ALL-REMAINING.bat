@echo off
echo Committing all remaining changes...
git add .
git commit -m "Chore: Commit all remaining file changes (Models, Controllers, Config)"
echo.
echo ✅ Remaining files committed!
pause
