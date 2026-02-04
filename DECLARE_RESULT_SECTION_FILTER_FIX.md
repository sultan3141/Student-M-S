# Declare Result - Section-Specific Assessment Filter

## Issue
The `getAssessments()` method was showing assessments from ALL sections of a grade, not just the selected section. This meant students in Section A could see assessments created for Section B.

## What Was Wrong

**Before:**
```php
$assessments = \App\Models\Assessment::where('grade_id', $request->grade_id)
    ->where(function ($query) use ($request) {
        $query->where('section_id', $request->section_id)
              ->orWhereNull('section_id'); // ❌ Also included null sections
    })
    ->where('subject_id', $request->subject_id)
    ->where('academic_year_id', $academicYear->id)
    ->get();
```

**Problem:**
- Used `orWhereNull('section_id')` which included assessments without a section
- Didn't properly validate `section_id` parameter
- Could show assessments from other sections

## What's Fixed

**After:**
```php
public function getAssessments(Request $request)
{
    $request->validate([
        'grade_id' => 'required|exists:grades,id',
        'section_id' => 'required|exists:sections,id', // ✓ Now required
        'subject_id' => 'required|exists:subjects,id',
    ]);

    $academicYear = AcademicYear::where('is_current', true)->first();

    // Get assessments for the SPECIFIC section only
    $assessments = \App\Models\Assessment::where('grade_id', $request->grade_id)
        ->where('section_id', $request->section_id) // ✓ Only this section
        ->where('subject_id', $request->subject_id)
        ->where('academic_year_id', $academicYear->id)
        ->with('assessmentType')
        ->get()
        ->map(function ($assessment) {
            return [
                'id' => $assessment->id,
                'name' => $assessment->name,
                'total_marks' => $assessment->max_score,
                'max_score' => $assessment->max_score,
                'due_date' => $assessment->due_date,
                'status' => $assessment->status,
            ];
        });

    return response()->json($assessments);
}
```

## Changes Made

1. ✅ Added `section_id` to validation rules (required)
2. ✅ Removed `orWhereNull('section_id')` condition
3. ✅ Now filters strictly by the selected section
4. ✅ Frontend already passes `section_id` correctly

## Behavior Now

### Declare Result Flow:
1. **Step 1**: Select Grade (e.g., Grade 10)
2. **Step 2**: Select Section (e.g., Section A)
3. **Step 3**: Select Students (from Section A only)
4. **Step 4**: Select Subject (e.g., Mathematics)
5. **Step 5**: Shows assessments for **Grade 10, Section A, Mathematics ONLY**

### Example Scenario:

**Database:**
- Assessment 1: Grade 10, Section A, Mathematics, "Midterm Exam"
- Assessment 2: Grade 10, Section B, Mathematics, "Midterm Exam"
- Assessment 3: Grade 10, Section A, Physics, "Quiz 1"

**When teacher selects:**
- Grade: 10
- Section: A
- Subject: Mathematics

**Result:**
- ✅ Shows: Assessment 1 only
- ❌ Hides: Assessment 2 (different section)
- ❌ Hides: Assessment 3 (different subject)

## Files Modified

- `app/Http/Controllers/TeacherDeclareResultController.php`
  - Updated `getAssessments()` method
  - Added `section_id` validation
  - Removed null section filter

## Testing

### Test Case 1: Section A Students
1. Login as teacher
2. Declare Result → Grade 10 → Section A → Mathematics
3. Should see only Section A assessments

### Test Case 2: Section B Students
1. Login as teacher
2. Declare Result → Grade 10 → Section B → Mathematics
3. Should see only Section B assessments

### Test Case 3: Different Subjects
1. Login as teacher
2. Declare Result → Grade 10 → Section A → Physics
3. Should see only Physics assessments for Section A

## Success Criteria ✓

- [x] Assessments filtered by specific section
- [x] Students only see their section's assessments
- [x] No cross-section data leakage
- [x] Validation ensures section_id is provided
- [x] Frontend already passes correct parameters

## Impact

**Security**: ✓ Prevents students from one section seeing another section's assessments
**Accuracy**: ✓ Teachers enter marks for the correct section only
**Data Integrity**: ✓ Marks are linked to the correct section's assessments
