# How to Activate/Deactivate Academic Years

## Current Status
✅ **Year "2025-2026" is now ACTIVE** (activated via script)

## Method 1: Using the Web Interface

### To Activate a Year:
1. Go to **Director Dashboard** → **Academic Management**
2. Scroll down to the **Archives** section
3. Find the year you want to activate (e.g., "2025-2026")
4. Click on it to expand
5. Click the **"Reactivate Year"** button
6. Confirm the action

### To Deactivate a Year:
1. Go to **Director Dashboard** → **Academic Management**
2. In the **Current Academic Year** section, you'll see the active year
3. Currently, there's a button to toggle active/inactive status
4. Click the button next to the year name to toggle its status

## Method 2: Using PHP Script (What We Just Did)

Run this command:
```bash
php activate_year.php
```

This script:
- Finds the "2025-2026" academic year
- Sets `is_current = true`
- Shows all years and their status

## Method 3: Using Database Query

If you have direct database access:
```sql
-- Activate a specific year
UPDATE academic_years SET is_current = true WHERE name = '2025-2026';

-- Deactivate a specific year
UPDATE academic_years SET is_current = false WHERE name = '2025-2026';

-- See all years
SELECT id, name, is_current, status FROM academic_years ORDER BY start_date DESC;
```

## Understanding the System

### Multiple Active Years
Based on your earlier request, the system now allows **multiple years to be active simultaneously**. This means:
- You can have "2025-2026" active
- You can have "2019" active
- Both can be active at the same time

### Year Status vs is_current
- **is_current**: Boolean flag (true/false) - determines if year is "active"
- **status**: String ('active', 'inactive', 'planned') - calculated from semester statuses

### What Happens When You Activate a Year
1. The year's `is_current` flag is set to `true`
2. The year appears in the "Current Academic Year" section
3. Teachers and students can work with that year
4. Semester controls become available

## Current Active Years
After running the script:
- ✓ **2025-2026** (ID: 1) - ACTIVE
- ✓ **2019** (ID: 4) - ACTIVE

## Next Steps

1. **Refresh your browser** (Ctrl+Shift+R on Windows)
2. Go to **Director Dashboard** → **Academic Management**
3. You should now see "2025-2026" in the "Current Academic Year" section
4. You can now:
   - Open Semester 1 for "2025-2026"
   - Open Semester 2 for "2025-2026"
   - Manage semester access
   - Control the academic calendar

## If You Want Only One Active Year

If you want to deactivate "2019" and keep only "2025-2026" active, run:

```bash
php artisan tinker
```

Then:
```php
\App\Models\AcademicYear::where('name', '2019')->update(['is_current' => false]);
```

Or create a script to do it automatically.

## Troubleshooting

### Year Not Showing as Active in UI
1. Clear cache: `php artisan cache:clear`
2. Clear view cache: `php artisan view:clear`
3. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### PostgreSQL Boolean Error
If you see "Datatype mismatch" error, use raw SQL:
```php
\DB::statement("UPDATE academic_years SET is_current = true WHERE id = ?", [$yearId]);
```

### Button Not Working
1. Check browser console for JavaScript errors
2. Verify route is defined: `php artisan route:list | grep set-current`
3. Check if middleware is blocking the request
