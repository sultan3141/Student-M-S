# Assessment Creation Troubleshooting Guide

## Issue: Redirects to Home Page Instead of Create Assessment Page

### Symptom
When clicking "Create Assessment" from the Teacher Dashboard, you're redirected back to the home page or dashboard instead of seeing the assessment creation form.

### Root Cause
The logged-in user has the "teacher" role but doesn't have a corresponding teacher profile record in the `teachers` table.

### Quick Fix

**Option 1: Run the Fix Script (Easiest)**
```bash
# Double-click this file or run in command prompt:
fix-teacher-profiles.bat
```

**Option 2: Run the Seeder Manually**
```bash
.\composer.bat exec -- php artisan db:seed --class=CreateMissingTeacherProfiles
```

**Option 3: Create Profile for Specific User**
```bash
.\composer.bat exec -- php artisan teacher:create-profile 3
# Replace 3 with the actual user ID
```

### Verification Steps

After running the fix:

1. **Check if teacher profile was created:**
   - Look for success message in the console
   - Should say "Created teacher profile for user: [Name]"

2. **Test the assessment creation:**
   - Login as the teacher
   - Navigate to Assessments
   - Click "Create Assessment"
   - You should now see the class selection page

3. **Check for error messages:**
   - If you see "No classes assigned", the teacher needs class assignments
   - If you see "No active academic year", an academic year needs to be set as current

## Common Issues and Solutions

### Issue 1: "No classes assigned"

**Cause:** Teacher profile exists but has no class assignments

**Solution:**
1. Login as Director/Admin
2. Go to Teacher Management
3. Assign classes to the teacher
4. Or run: `php artisan db:seed --class=TeacherAssignmentSeeder`

### Issue 2: "No active academic year found"

**Cause:** No academic year is marked as current

**Solution:**
1. Login as Registrar/Admin
2. Go to Academic Year Management
3. Set an academic year as "Current"
4. Or update database directly:
```sql
UPDATE academic_years SET is_current = 1 WHERE id = 1;
```

### Issue 3: "No subjects available for this class"

**Cause:** Teacher is assigned to the class but not to any subjects in that class

**Solution:**
1. Ensure teacher has subject assignments for the selected class
2. Check `teacher_assignments` table has records with:
   - teacher_id
   - grade_id
   - section_id
   - subject_id

### Issue 4: "No assessment types configured"

**Cause:** No assessment types have been created for the selected subject

**Solution:**
1. Login as Registrar
2. Go to Assessment Types Management
3. Create assessment types for the grade/section/subject combination

## Database Checks

### Check if teacher profile exists:
```sql
SELECT u.id, u.name, u.email, t.id as teacher_id
FROM users u
LEFT JOIN teachers t ON u.id = t.user_id
WHERE u.id = 3;  -- Replace with your user ID
```

### Check teacher assignments:
```sql
SELECT ta.*, g.name as grade, s.name as section, sub.name as subject
FROM teacher_assignments ta
JOIN grades g ON ta.grade_id = g.id
JOIN sections s ON ta.section_id = s.id
JOIN subjects sub ON ta.subject_id = sub.id
WHERE ta.teacher_id = 1;  -- Replace with teacher ID
```

### Check academic year:
```sql
SELECT * FROM academic_years WHERE is_current = 1;
```

## Prevention

To prevent this issue in the future:

1. **When creating new teacher users:**
   - Always create user first
   - Assign "teacher" role
   - Create teacher profile immediately
   - Assign classes and subjects

2. **Use the proper workflow:**
   - Director/Admin creates teacher account
   - System automatically creates teacher profile
   - Director assigns classes and subjects
   - Teacher can then create assessments

3. **Regular checks:**
   - Run `CreateMissingTeacherProfiles` seeder periodically
   - Monitor for users with teacher role but no profile

## Files Involved

- **Controller:** `app/Http/Controllers/TeacherAssessmentController.php`
- **Model:** `app/Models/Teacher.php`
- **Seeder:** `database/seeders/CreateMissingTeacherProfiles.php`
- **Command:** `app/Console/Commands/CreateTeacherProfile.php`
- **Fix Script:** `fix-teacher-profiles.bat`

## Support

If the issue persists after trying these solutions:

1. Check Laravel logs: `storage/logs/laravel.log`
2. Check browser console for JavaScript errors (F12)
3. Verify database connection is working
4. Ensure all migrations have been run
5. Clear cache: `php artisan cache:clear`

## Success Indicators

You'll know it's working when:
- ✅ No redirect to home page
- ✅ See "Select Class" heading
- ✅ See list of assigned classes (or "No classes assigned" message)
- ✅ Debug info panel shows: "Classes: [number]"
- ✅ Can select a class and proceed to form

---

**Last Updated:** February 2, 2026
**Status:** Active troubleshooting guide
