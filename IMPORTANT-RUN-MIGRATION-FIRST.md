# ⚠️ IMPORTANT: Run Migration First!

## Problem
You're getting an error when trying to create subjects because the database doesn't have the `stream_id` column yet.

## Solution
Run the migration to add the `stream_id` column to the subjects table.

### Step 1: Run the Migration

**Option A: Double-click the batch file**
```
RUN-MIGRATION.bat
```

**Option B: Run manually in terminal**
```bash
php artisan migrate
```

### Step 2: Try Creating a Subject Again

After running the migration, you should be able to create subjects successfully!

## What the Migration Does

The migration file `database/migrations/2026_02_02_000000_add_stream_to_subjects_table.php` will:
- Add a `stream_id` column to the `subjects` table
- Set it as a foreign key linking to the `streams` table
- Make it nullable (for Grades 9 & 10 that don't need streams)

## After Migration

Once the migration runs successfully, you can:
1. Create subjects for Grade 9 & 10 (no stream required)
2. Create subjects for Grade 11 & 12 (stream selection required)
3. Subject codes will be auto-generated
4. Subjects will be auto-assigned to relevant sections

## If You Get Errors

If you see any errors when running the migration, send me the error message and I'll help you fix it!
