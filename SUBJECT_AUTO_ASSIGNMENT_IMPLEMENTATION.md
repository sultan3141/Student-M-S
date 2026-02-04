# Subject Auto-Assignment Implementation

## Overview
Implemented automatic subject assignment to sections when a subject is created, with stream-based filtering for Grades 11 & 12.

## Implementation Date
February 2, 2026

## Changes Made

### 1. Database Schema Updates

#### Migration: `2026_02_02_000000_add_stream_to_subjects_table.php`
- Added `stream_id` foreign key column to `subjects` table
- Links subjects to streams for Grade 11 & 12 filtering
- Nullable to support Grades 9 & 10 (no stream required)

### 2. Model Updates

#### `app/Models/Subject.php`
- Added `stream_id` to fillable array
- Added `stream()` relationship method
- Enables subjects to be associated with specific streams

### 3. Controller Updates

#### `app/Http/Controllers/RegistrarAdmissionController.php`

**Added Import:**
- `use App\Models\Stream;`

**Updated `createSubject()` Method:**
- Now fetches and passes `streams` data to frontend
- Provides stream options for Grade 11 & 12 subjects

**Updated `storeSubject()` Method:**
- Removed `code` from validation (now auto-generated)
- Validates `stream_id` as required for Grades 11 & 12
- Validates `stream_id` as nullable for Grades 9 & 10
- **Auto-generates subject code** using `generateSubjectCode()` method
- **Auto-Assignment Logic:**
  - **For Grades 11 & 12:** Assigns subject to all sections with matching grade AND stream
  - **For Grades 9 & 10:** Assigns subject to all sections of the same grade
- Inserts records into `grade_subject` pivot table
- Returns success message with subject name, code, section count, and stream info

**New `generateSubjectCode()` Method:**
- Automatically generates unique subject codes
- Format: `PREFIX-GRADE-STREAM` (e.g., MATH-10, PHYS-11-N, HIST-12-S)
- Multi-word subjects: Takes first letter of each word (max 4)
- Single-word subjects: Takes first 4 letters
- Adds grade number from grade name
- Adds stream code (N for Natural, S for Social) if applicable
- Ensures uniqueness by adding numeric suffix if needed

### 4. Frontend Updates

#### `resources/js/Pages/Registrar/Admission/CreateSubject.jsx`

**Props Updated:**
- Added `streams` prop to receive stream data from backend
- Removed `teachers` prop (no longer needed)

**Form Data:**
- Removed `code` field (now auto-generated)
- Changed from `stream` (string) to `stream_id` (integer)
- Maintains grade_id and name fields

**UI Changes:**
- Removed Subject Code input field
- Added help text: "Subject code will be automatically generated based on the subject name"
- Stream selection dynamically populated from database streams
- Only appears for Grade 11 & 12
- Required when visible
- Updated help text to reflect auto-assignment behavior

**Removed:**
- Primary Teacher field and all related code
- Subject Code input field
- Teacher assignment logic (moved to separate workflow)

## Auto-Assignment Rules

### Grade 9 & 10 Subjects
```
Subject Created → Code Auto-Generated → Assigned to ALL sections of the same grade
Example: "Mathematics" → Code: MATH-9 → All Grade 9 sections (A, B, C, etc.)
```

### Grade 11 & 12 Subjects
```
Subject Created → Code Auto-Generated → Assigned to sections with matching grade AND stream
Example: "Physics" → Code: PHYS-11-N → Only Grade 11 Natural sections
Example: "History" → Code: HIST-12-S → Only Grade 12 Social sections
```

## Subject Code Generation

### Format
- **Single Word:** First 4 letters + Grade + Stream (optional)
  - "Mathematics" Grade 10 → `MATH-10`
  - "Physics" Grade 11 Natural → `PHYS-11-N`
  
- **Multiple Words:** First letter of each word (max 4) + Grade + Stream (optional)
  - "Advanced Mathematics" Grade 10 → `AM-10`
  - "Social Studies" Grade 12 Social → `SS-12-S`
  - "Information and Communication Technology" Grade 11 Natural → `IACT-11-N`

### Stream Codes
- `N` = Natural Science
- `S` = Social Science

### Uniqueness
- If code already exists, adds numeric suffix: `MATH-10-1`, `MATH-10-2`, etc.

## Database Structure

### Subjects Table
```
- id
- name
- code
- grade_id (foreign key)
- stream_id (foreign key, nullable)
- description
- timestamps
```

### Grade-Subject Pivot Table
```
- id
- grade_id
- section_id
- subject_id
- is_active (boolean)
- timestamps
```

## User Experience

### Subject Creation Flow
1. Registrar enters subject name
2. Registrar selects grade (9, 10, 11, or 12)
3. If Grade 11 or 12: Stream selection appears (required)
4. If Grade 9 or 10: No stream selection needed
5. On submit: 
   - Subject code is automatically generated
   - Subject is created
   - Subject is automatically assigned to relevant sections
6. Success message shows: "Subject '[Name]' (Code: [CODE]) created successfully and automatically assigned to X section(s) [stream name]!"

## Benefits

1. **Eliminates Manual Work:** No need to manually assign subjects to each section or create subject codes
2. **Reduces Errors:** Automatic assignment and code generation ensures consistency
3. **Stream-Aware:** Correctly handles stream-based filtering for senior grades
4. **Flexible:** Works for both stream-based (11-12) and non-stream (9-10) grades
5. **Transparent:** Success message confirms subject code and how many sections received the subject
6. **Unique Codes:** Automatically ensures subject codes are unique across the system

## Testing Checklist

- [ ] Create Grade 9 subject → Verify code generated (e.g., MATH-9) and assigned to all Grade 9 sections
- [ ] Create Grade 10 subject → Verify code generated and assigned to all Grade 10 sections
- [ ] Create Grade 11 Natural subject → Verify code includes N (e.g., PHYS-11-N) and assigned only to Grade 11 Natural sections
- [ ] Create Grade 11 Social subject → Verify code includes S and assigned only to Grade 11 Social sections
- [ ] Create Grade 12 Natural subject → Verify code generated correctly and assigned only to Grade 12 Natural sections
- [ ] Create Grade 12 Social subject → Verify code generated correctly and assigned only to Grade 12 Social sections
- [ ] Create duplicate subject name → Verify code gets numeric suffix (e.g., MATH-10-1)
- [ ] Verify stream field is required for Grades 11 & 12
- [ ] Verify stream field is hidden for Grades 9 & 10
- [ ] Check success message displays subject name, code, and correct section count
- [ ] Test multi-word subject names → Verify code uses first letters (e.g., "Social Studies" → SS-12-S)

## Migration Required

Before testing, run:
```bash
php artisan migrate
```

This will add the `stream_id` column to the subjects table.

## Files Modified

1. `database/migrations/2026_02_02_000000_add_stream_to_subjects_table.php` (NEW)
2. `app/Models/Subject.php`
3. `app/Http/Controllers/RegistrarAdmissionController.php`
4. `resources/js/Pages/Registrar/Admission/CreateSubject.jsx`

## Related Documentation

- See `ADMISSION_SYSTEM_COMPLETE.md` for overall admission system
- See `ASSESSMENT_TYPES_IMPLEMENTATION.md` for assessment configuration
