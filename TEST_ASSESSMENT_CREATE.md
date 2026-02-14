# Test Assessment Creation

## Steps to Debug

### 1. Check Browser Console
Press F12 and go to Console tab. Look for:
- Red error messages
- Network requests to `/teacher/assessments`
- Response status code (200 = success, 400/500 = error)

### 2. Check Network Tab
1. Press F12
2. Go to "Network" tab
3. Fill the form and click "Create"
4. Look for the POST request to `/teacher/assessments`
5. Click on it and check:
   - **Status**: Should be 200
   - **Response**: Should show success message or error
   - **Preview**: Shows the actual response data

### 3. Check Laravel Logs
Open the file: `Student-M-S/storage/logs/laravel.log`

Look for recent errors with timestamps matching when you clicked "Create".

### 4. Common Issues

#### Issue A: Validation Error
**Symptoms**: 422 status code
**Cause**: Missing or invalid fields
**Solution**: Check which field is failing validation

#### Issue B: Database Error
**Symptoms**: 500 status code, "SQLSTATE" in error
**Cause**: Database constraint or missing column
**Solution**: Check database schema matches model

#### Issue C: No Academic Year
**Symptoms**: "No active academic year found"
**Cause**: No academic year marked as current
**Solution**: Set an academic year as current in database

#### Issue D: No Teacher Profile
**Symptoms**: "Teacher profile not found"
**Cause**: Logged-in user doesn't have teacher record
**Solution**: Create teacher profile for the user

### 5. Manual Test via Browser Console

Open browser console (F12) and run:

```javascript
// Test if route exists
console.log(route('teacher.assessments.store'));

// Test API call manually
axios.post(route('teacher.assessments.store'), {
    grade_id: 1,  // Change to your grade ID
    section_id: 1,  // Change to your section ID
    subject_id: 1,  // Change to your subject ID
    name: "Test Assessment",
    max_score: 10,
    assessment_type_id: null,
    description: "Test"
})
.then(response => {
    console.log('Success:', response.data);
})
.catch(error => {
    console.error('Error:', error.response?.data || error.message);
});
```

### 6. Check Database

Run these SQL queries to verify data:

```sql
-- Check if academic year exists and is current
SELECT * FROM academic_years WHERE is_current = 1;

-- Check if teacher profile exists for your user
SELECT t.* FROM teachers t 
JOIN users u ON t.user_id = u.id 
WHERE u.email = 'your-email@example.com';

-- Check if grades exist
SELECT * FROM grades LIMIT 5;

-- Check if sections exist
SELECT * FROM sections LIMIT 5;

-- Check if subjects exist
SELECT * FROM subjects LIMIT 5;
```

### 7. Expected Request Format

The frontend should send:
```json
{
  "grade_id": 1,
  "section_id": 2,
  "subject_id": 3,
  "name": "Unit Test 1",
  "max_score": 10,
  "assessment_type_id": null,
  "description": ""
}
```

### 8. Expected Response Format

Success (200):
```json
{
  "success": true,
  "message": "Assessment created successfully!",
  "assessment": {
    "id": 123,
    "name": "Unit Test 1",
    "max_score": 10,
    ...
  }
}
```

Error (422 - Validation):
```json
{
  "error": "Validation failed",
  "details": {
    "name": ["The name field is required."]
  }
}
```

Error (500 - Server):
```json
{
  "error": "Failed to create assessment: [error message]"
}
```

## Quick Fixes

### Fix 1: Clear Everything
```bash
cd Student-M-S
php artisan cache:clear
php artisan view:clear
php artisan config:clear
php artisan route:clear
```

### Fix 2: Check Permissions
Make sure `storage/logs` is writable:
```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### Fix 3: Enable Debug Mode
In `.env` file, set:
```
APP_DEBUG=true
LOG_LEVEL=debug
```

Then try again and check `storage/logs/laravel.log`

## What to Share for Help

If still not working, share:
1. Screenshot of browser console errors
2. Screenshot of Network tab showing the request/response
3. Last 50 lines of `storage/logs/laravel.log`
4. The exact error message you see

---
**Created**: February 14, 2026
