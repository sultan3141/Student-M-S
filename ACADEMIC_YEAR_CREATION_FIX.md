# Academic Year Creation Fix

## Issue
Creating new academic years was failing with the error:
```
SQLSTATE[23000]: Integrity constraint violation: 19 CHECK constraint failed: status
```

## Root Cause
The `academic_years` table has a status enum column with these valid values:
- `'active'`
- `'inactive'`
- `'planned'`

However, the code was trying to use invalid values:
- `'completed'` (should be `'inactive'`)
- `'upcoming'` (should be `'planned'`)

This mismatch occurred because:
1. The original migration (`2026_01_17_171111_create_academic_structure_tables.php`) created the status column with `['active', 'inactive', 'planned']`
2. A later migration (`2026_02_03_180301_add_status_to_academic_years_table.php`) tried to add the column again with `['upcoming', 'active', 'completed']`, but it has a check `if (!Schema::hasColumn())` so it never runs
3. SQLite doesn't support modifying enum columns easily
4. The code was updated to use the new values, but the database still had the old enum definition

## Solution
Updated the code to use the correct enum values that match the database:

### 1. Fixed `AcademicYear` Model (`app/Models/AcademicYear.php`)
Changed `getOverallStatus()` method to return:
- `'planned'` instead of `'upcoming'`
- `'inactive'` instead of `'completed'`

### 2. Fixed `AcademicYearController` (`app/Http/Controllers/Director/AcademicYearController.php`)
Changed `store()` method to use:
- `'planned'` instead of `'upcoming'`

The `createNextAcademicYear()` method was already using `'active'` which is correct.

## Status Mapping
- **planned**: Year is created but not yet started (previously "upcoming")
- **active**: Year is currently in progress with at least one semester open
- **inactive**: Year is finished with all semesters closed (previously "completed")

## Cache Clearing
After fixing the code, the following caches were cleared:
```bash
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

## Next Steps
**IMPORTANT**: Restart the PHP development server to ensure the updated code is loaded:
```bash
C:\php\php.exe -d extension=pdo_sqlite -S 127.0.0.1:8000 -t public
```

## Testing
After restarting the server:
1. Log in as Director
2. Navigate to Academic Years management
3. Close Semester 2 of the current year
4. Verify that:
   - Final results are calculated
   - Current year status changes to `'inactive'`
   - Next academic year is automatically created with status `'active'`
   - New year is set as current
   - Semester 1 of new year is automatically opened

## Files Modified
- `app/Models/AcademicYear.php` - Fixed `getOverallStatus()` method
- `app/Http/Controllers/Director/AcademicYearController.php` - Fixed `store()` method

## Files Analyzed
- `database/migrations/2026_01_17_171111_create_academic_structure_tables.php` - Original enum definition
- `database/migrations/2026_02_03_180301_add_status_to_academic_years_table.php` - Attempted enum change (never runs)
