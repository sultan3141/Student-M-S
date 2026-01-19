@echo off
echo Resolving Conflicts and Pushing...

:: 1. Add resolved files
git add bootstrap/app.php
git add routes/web.php
git add app/Models/User.php

:: 2. Allow empty commit if merge is already technically done via add
git commit -m "Merge: Resolve conflicts between Director and Parent modules"

:: 3. Final Push
git push origin main

echo.
echo ✅ Conflicts Resolved & Pushed!
pause
