# Semester Management System Implementation

## Overview
A comprehensive result management system with semester open/close controls managed by the Director.

## System Architecture

### 1. Database Schema Requirements

#### New Table: `semester_periods`
```sql
- id
- academic_year_id (FK)
- semester (1 or 2)
- status (enum: 'open', 'closed')
- opened_at (timestamp)
- closed_at (timestamp)
- opened_by (FK to users - Director)
- closed_by (FK to users - Director)
- created_at
- updated_at
```

#### Modifications to Existing Tables

**assessments table:**
- Add: `is_editable` (boolean, default true)
- Add: `locked_at` (timestamp, nullable)

**marks table:**
- Add: `is_locked` (boolean, default false)
- Add: `locked_at` (timestamp, nullable)

### 2. Role-Based Access Control

#### Director Permissions
- Open/Close semesters
- View all results (read-only when closed)
- Reopen closed semesters
- View semester status dashboard

#### Teacher Permissions
- Enter/Edit results ONLY when semester is OPEN
- View all past results (read-only)
- Cannot modify closed semester results
- Receive notifications when semester opens/closes

#### Student Permissions
- View results ONLY for CLOSED semesters
- Cannot see results for OPEN semesters
- View organized by: Grade → Year → Semester

### 3. Implementation Components

#### A. Migration Files
1. `create_semester_periods_table.php`
2. `add_locking_fields_to_assessments_marks.php`

#### B. Models
1. `SemesterPeriod.php` - New model
2. Update `Assessment.php` - Add locking methods
3. Update `Mark.php` - Add locking methods

#### C. Controllers
1. `DirectorSemesterController.php` - Semester management
2. Update `TeacherDeclareResultController.php` - Check semester status
3. Update `StudentController.php` - Filter by closed semesters
4. Update `SemesterRecordController.php` - Show only closed

#### D. Middleware
1. `CheckSemesterOpen.php` - Verify semester is open for teachers
2. `CheckSemesterClosed.php` - Verify semester is closed for students

#### E. Frontend Components
1. Director Dashboard - Semester control panel
2. Teacher Dashboard - Status indicator
3. Student Dashboard - Organized results view

### 4. Workflow Implementation

#### Opening a Semester
1. Director clicks "Open Semester X"
2. System creates/updates `semester_periods` record
3. Sets status = 'open'
4. Unlocks all assessments/marks for that semester
5. Notifies all teachers
6. Students cannot see results

#### Closing a Semester
1. Director clicks "Close Semester X"
2. System updates `semester_periods` record
3. Sets status = 'closed'
4. Locks all assessments/marks for that semester
5. Makes results visible to students
6. Notifies teachers (read-only mode)

#### Reopening a Semester
1. Director clicks "Reopen Semester X"
2. System updates status back to 'open'
3. Unlocks assessments/marks
4. Hides results from students
5. Notifies teachers (editing enabled)

### 5. UI/UX Design

#### Director Dashboard - Semester Control Panel
```
┌─────────────────────────────────────────┐
│ Academic Year 2024 - Semester Management│
├─────────────────────────────────────────┤
│ Semester 1                              │
│ Status: [CLOSED] ✓                      │
│ Closed on: Jan 15, 2024                 │
│ [Reopen Semester 1]                     │
├─────────────────────────────────────────┤
│ Semester 2                              │
│ Status: [OPEN] 🔓                       │
│ Opened on: Feb 1, 2024                  │
│ [Close Semester 2]                      │
└─────────────────────────────────────────┘
```

#### Teacher Dashboard - Status Indicator
```
┌─────────────────────────────────────────┐
│ Current Semester: 2 (OPEN) 🔓          │
│ You can enter/edit results              │
├─────────────────────────────────────────┤
│ Previous Semesters (Read-Only)          │
│ • Semester 1 - 2024 (Closed) 🔒        │
└─────────────────────────────────────────┘
```

#### Student Dashboard - Results View
```
┌─────────────────────────────────────────┐
│ Grade 10 - Academic Year 2024           │
├─────────────────────────────────────────┤
│ ✓ Semester 1 Results (Available)        │
│   Average: 85.5% | Rank: 5/40          │
│   [View Details]                        │
├─────────────────────────────────────────┤
│ ⏳ Semester 2 (In Progress)             │
│   Results will be available when        │
│   semester is closed by Director        │
└─────────────────────────────────────────┘
```

### 6. Business Rules

1. **Only ONE semester can be OPEN at a time per academic year**
2. **Semester 2 cannot be opened until Semester 1 is closed**
3. **Teachers cannot access results entry when semester is closed**
4. **Students cannot see results until semester is closed**
5. **Director can reopen any semester at any time**
6. **All changes are logged in audit trail**

### 7. Validation Rules

- Cannot close semester if no results entered
- Cannot open Semester 2 if Semester 1 is still open
- Cannot delete closed semester data
- Must have Director role to manage semesters

### 8. Notifications

#### When Semester Opens:
- Email to all teachers: "Semester X is now open for result entry"
- Dashboard notification

#### When Semester Closes:
- Email to teachers: "Semester X is now closed - results are read-only"
- Email to students: "Your Semester X results are now available"
- Dashboard notifications

### 9. API Endpoints

```
Director:
POST   /director/semesters/open
POST   /director/semesters/close
POST   /director/semesters/reopen
GET    /director/semesters/status

Teacher:
GET    /teacher/semester/current-status
GET    /teacher/results/editable-semesters

Student:
GET    /student/results/available-semesters
GET    /student/results/{grade}/{year}/{semester}
```

### 10. Implementation Priority

**Phase 1: Database & Models**
- Create migration for semester_periods
- Add locking fields to assessments/marks
- Create SemesterPeriod model

**Phase 2: Director Controls**
- Build DirectorSemesterController
- Create Director UI for semester management
- Implement open/close/reopen logic

**Phase 3: Teacher Integration**
- Add middleware to check semester status
- Update TeacherDeclareResultController
- Add status indicators to Teacher UI

**Phase 4: Student Integration**
- Filter results by closed semesters
- Update Student dashboard
- Organize results by Grade → Year → Semester

**Phase 5: Testing & Refinement**
- Test all role permissions
- Test semester transitions
- Test edge cases

## Next Steps

1. Create database migration
2. Build SemesterPeriod model
3. Implement Director controller
4. Create Director UI
5. Add middleware for access control
6. Update Teacher/Student controllers
7. Build frontend components
8. Test complete workflow
