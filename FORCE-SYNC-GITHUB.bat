@echo off
echo ==========================================
echo    FINAL GITHUB SYNC (Pull & Push)
echo ==========================================

:: 1. Safety Commit
echo.
echo [1/3] Saving all current work...
git add .
git commit -m "Final Project Sync: Uploading Director Module & Updates"

:: 2. Pull Remote Changes (Merge)
echo.
echo [2/3] Merging remote changes...
git pull origin main --no-rebase

:: 3. Push to GitHub
echo.
echo [3/3] Pushing to GitHub...
git push origin main

echo.
echo ==========================================
echo    ✅ DONE! Check GitHub now.
echo ==========================================
pause
