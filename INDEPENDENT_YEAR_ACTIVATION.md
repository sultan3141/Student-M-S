# Independent Academic Year Activation

## Feature
You can now activate or deactivate any academic year independently without affecting other years.

## How It Works

### Before (Old Behavior)
- Only ONE year could be active at a time
- Activating a year would automatically deactivate all other years
- No way to have multiple active years or deactivate all years

### After (New Behavior)
- Each year can be activated/deactivated independently
- Click "Active Cycle" → becomes "Inactive"
- Click "Inactive" → becomes "Active Cycle"
- You can have:
  - Multiple active years at the same time
  - All years inactive
  - Any combination you want

## Use Cases

### Multiple Active Years
Useful when:
- Transitioning between academic years
- Running overlapping programs
- Managing different school branches with different calendars
- Testing or preparing next year while current year is still active

### All Years Inactive
Useful when:
- School is closed (summer break, holidays)
- System maintenance
- Preparing for new academic cycle
- Archiving old data

### Single Active Year
Traditional approach:
- One year active for normal operations
- Clear which year is "current"
- Simpler for teachers and students

## How to Use

### Activate a Year
1. Go to Academic Year management page
2. Find the year you want to activate
3. Click the "Inactive" badge
4. Year becomes "Active Cycle"

### Deactivate a Year
1. Go to Academic Year management page
2. Find the active year
3. Click the "Active Cycle" badge
4. Year becomes "Inactive"

### Toggle Multiple Years
1. Click on any year's status badge
2. It toggles independently
3. Other years remain unchanged
4. No restrictions on how many can be active

## Visual Indicators

**Active Year**:
- Badge shows: "Active Cycle" (blue color)
- Indicates year is operational
- Teachers can enter marks
- Students can see results

**Inactive Year**:
- Badge shows: "Inactive" (gray color)
- Year is archived or not yet started
- Limited operations available
- Historical data still accessible

## Technical Details

### Code Change
**File**: `app/Http/Controllers/Director/AcademicYearController.php`

**Method**: `setCurrent($id)`

**Before**:
```php
// Deactivate ALL other years first
AcademicYear::whereRaw("is_current = true")
    ->update(['is_current' => false]);

// Then activate this year
$year->update(['is_current' => true]);
```

**After**:
```php
// Simply toggle this year's status
$newStatus = !$year->is_current;
$year->update(['is_current' => $newStatus]);
```

### Database
- Column: `academic_years.is_current` (boolean)
- `true` = Active
- `false` = Inactive
- No constraints on how many can be true

## Important Notes

### System Behavior
1. **Teacher Dashboard**: Shows data from active years
2. **Student Results**: Accessible for all years (active or not)
3. **Mark Entry**: Depends on semester status, not year status
4. **Reports**: Can filter by any year regardless of status

### Best Practices
1. **Keep one year active** for normal operations
2. **Activate next year early** for preparation
3. **Deactivate old years** after archiving
4. **Use semester controls** for mark entry restrictions

### Semester vs Year Status
- **Year Status** (is_current): Overall year activation
- **Semester Status** (open/closed): Controls mark entry
- Both are independent:
  - Year can be active with semesters closed
  - Year can be inactive with semesters open (not recommended)

## Examples

### Example 1: Normal Operation
```
2023-2024: Inactive (archived)
2024-2025: Active Cycle (current)
2025-2026: Inactive (not started)
```

### Example 2: Transition Period
```
2023-2024: Inactive (archived)
2024-2025: Active Cycle (finishing)
2025-2026: Active Cycle (preparing)
```

### Example 3: Summer Break
```
2023-2024: Inactive (archived)
2024-2025: Inactive (completed)
2025-2026: Inactive (not started)
```

### Example 4: Multiple Branches
```
2024-2025 (Branch A): Active Cycle
2024-2025 (Branch B): Active Cycle
2025-2026 (Branch A): Active Cycle (early start)
```

## Testing

### Test 1: Activate Year
1. Find an inactive year
2. Click "Inactive" badge
3. ✅ Should become "Active Cycle"
4. ✅ Other years should remain unchanged

### Test 2: Deactivate Year
1. Find an active year
2. Click "Active Cycle" badge
3. ✅ Should become "Inactive"
4. ✅ Other years should remain unchanged

### Test 3: Multiple Active
1. Activate year 2024-2025
2. Activate year 2025-2026
3. ✅ Both should show "Active Cycle"
4. ✅ System should work normally

### Test 4: All Inactive
1. Deactivate all years
2. ✅ All should show "Inactive"
3. ✅ System should still be accessible
4. ✅ Historical data should be viewable

## Troubleshooting

### Issue: Badge not changing
**Solution**: Hard refresh browser (Ctrl+Shift+R)

### Issue: Error when clicking badge
**Solution**: Check Laravel logs, ensure database connection

### Issue: Want only one active year
**Solution**: Manually deactivate other years before activating new one

## Status
✅ **IMPLEMENTED** - Independent year activation now available

---
**Date**: February 14, 2026
**Feature**: Independent academic year activation/deactivation
**Type**: Enhancement
**Status**: ✅ Complete
