# Teacher Profile Fix

## Issue
When accessing the teacher assessment creation page, you may encounter an error:
```
ErrorException - Internal Server Error
Attempt to read property "id" on null
```

This occurs when a user has the "teacher" role but doesn't have a corresponding teacher profile record in the `teachers` table.

## Root Cause
The system expects every user with the "teacher" role to have a matching record in the `teachers` table. If this record is missing, the controller fails when trying to access `$teacher->id`.

## Solution

### Option 1: Using Artisan Command (Recommended)
We've created an artisan command to create teacher profiles for users:

```bash
# For Windows with composer.bat
.\composer.bat run-script post-autoload-dump
# Then run the command (replace 3 with the actual user ID)
php artisan teacher:create-profile 3
```

### Option 2: Manual Database Entry
If you have database access, you can manually create a teacher record:

```sql
INSERT INTO teachers (user_id, employee_id, first_name, last_name, email, phone, hire_date, status, created_at, updated_at)
VALUES (
    3,  -- user_id
    'T0003',  -- employee_id
    'Teacher Name',  -- first_name
    'Last Name',  -- last_name
    'teacher@example.com',  -- email
    '',  -- phone
    NOW(),  -- hire_date
    'active',  -- status
    NOW(),  -- created_at
    NOW()  -- updated_at
);
```

### Option 3: Using the Seeder
If you're setting up a new system, ensure you run the teacher seeder:

```bash
php artisan db:seed --class=TeacherSeeder
```

## Prevention
When creating new teacher users, always ensure:
1. User is created in the `users` table
2. User is assigned the "teacher" role
3. A corresponding record is created in the `teachers` table

## Code Changes Made
We've updated the `TeacherAssessmentController` to handle missing teacher profiles gracefully:

1. **index()** method: Shows an error message instead of crashing
2. **create()** method: Redirects to dashboard with error message
3. Added null checks before accessing teacher properties

## Files Modified
- `app/Http/Controllers/TeacherAssessmentController.php` - Added null checks
- `resources/js/Pages/Teacher/Assessments/Index.jsx` - Added error display
- `app/Console/Commands/CreateTeacherProfile.php` - New command to create profiles

## Testing
After applying the fix:
1. Login as a teacher user
2. Navigate to Assessments
3. Click "Create Assessment"
4. You should either see the class selection page OR a helpful error message

## Next Steps
If you see the error message:
1. Contact your system administrator
2. They will run the `teacher:create-profile` command for your user ID
3. Refresh the page and try again
