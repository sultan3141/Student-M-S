# Academic Year & Semester Management System - Complete Specification

## System Overview

A comprehensive system for managing academic years with automatic 2-semester structure and sequential progression control.

## Design Decisions

### 1. Semester Progression
- **Manual Control**: Director manually opens S2 after closing S1
- **Rationale**: Allows time for administrative tasks, grade processing, and planning between semesters

### 2. Grade Synchronization
- **School-Wide**: All grades progress together on the same semester
- **Rationale**: Simplifies management, aligns with typical school calendars, easier for parents/students

### 3. Year Creation
- **S1 Status**: OPEN (ready for immediate use)
- **S2 Status**: CLOSED (waiting for S1 completion)
- **Date Structure**: Director sets year dates only (start/end)
- **Semester Dates**: Implicit - S1 (start to mid-year), S2 (mid-year to end)

### 4. Dashboard Features
- Current semester display
- Status indicators
- Deadline countdowns
- Progress tracking

## Database Schema

### Using Existing Tables

#### `academic_years`
```sql
- id
- name (e.g., "2025-2026")
- start_date
- end_date
- is_current (boolean)
- status (enum: 'upcoming', 'active', 'completed')
- created_at
- updated_at
```

#### `semester_periods` (Already exists!)
```sql
- id
- academic_year_id (FK)
- semester (1 or 2)
- status (enum: 'open', 'closed')
- opened_at
- closed_at
- opened_by (FK to users)
- closed_by (FK to users)
- created_at
- updated_at
```

## Workflow

### 1. Create New Academic Year
```
Director → Create Year "2025-2026"
  ├── Set start_date: 2025-09-01
  ├── Set end_date: 2026-06-30
  └── System automatically creates:
      ├── Semester 1 (status: OPEN)
      └── Semester 2 (status: CLOSED)
```

### 2. Semester 1 Operations
```
Teachers → Enter marks for S1
  ├── Dashboard shows: "Semester 1 - OPEN"
  ├── Can create assessments
  ├── Can enter/edit marks
  └── Students cannot see results yet
```

### 3. Close Semester 1
```
Director → Close S1
  ├── Validates: At least some marks entered
  ├── Locks all S1 assessments/marks
  ├── Makes S1 results visible to students
  └── Enables "Open S2" button
```

### 4. Open Semester 2
```
Director → Open S2
  ├── Validates: S1 is closed
  ├── Opens S2 for mark entry
  └── Teachers can now enter S2 marks
```

### 5. Close Semester 2
```
Director → Close S2
  ├── Locks all S2 assessments/marks
  ├── Makes S2 results visible to students
  ├── Marks academic year as "completed"
  └── Prompts to create next year
```

### 6. Create Next Year
```
Director → Create "2026-2027"
  ├── Previous year status → "completed"
  ├── New year status → "active"
  └── Cycle repeats
```

## UI Components

### 1. Academic Year Management Page
**Route**: `/director/academic-years`

Features:
- List all years (past, current, future)
- Create new year
- View year details
- Set current year
- Year status indicators

### 2. Semester Control Page
**Route**: `/director/semesters`

Features:
- Visual timeline of S1 and S2
- Sequential control buttons
- Status indicators
- Open/Close actions
- Audit trail

### 3. Teacher Dashboard Widget
```jsx
┌─────────────────────────────────────┐
│ 📅 Current Semester                 │
│   Semester 1 - Academic Year 2025-26│
│   Status: 🟢 OPEN                   │
│   Closes: Feb 28, 2026 (45 days)   │
│   [Enter Marks] [View Students]     │
└─────────────────────────────────────┘
```

### 4. Student Dashboard Widget
```jsx
┌─────────────────────────────────────┐
│ 📚 Current Academic Period          │
│   Semester 1 - 2025-2026            │
│   Status: In Progress               │
│   Results available when semester   │
│   closes (estimated: Feb 28)        │
└─────────────────────────────────────┘
```

## Implementation Files

### Controllers
1. `DirectorAcademicYearController.php` - Year CRUD
2. `DirectorSemesterController.php` - Semester control (already exists)
3. Update `TeacherDashboardController.php` - Add semester widget
4. Update `StudentController.php` - Add semester widget

### Models
1. Update `AcademicYear.php` - Add helper methods
2. `SemesterPeriod.php` - Already exists

### Frontend
1. `Director/AcademicYears/Index.jsx` - Year management
2. `Director/AcademicYears/Create.jsx` - Create year
3. `Director/Semester/Index.jsx` - Already exists (enhance)
4. `Components/SemesterWidget.jsx` - Reusable widget

### Routes
```php
// Academic Year Management
Route::get('/director/academic-years', [DirectorAcademicYearController::class, 'index']);
Route::post('/director/academic-years', [DirectorAcademicYearController::class, 'store']);
Route::put('/director/academic-years/{id}/set-current', [DirectorAcademicYearController::class, 'setCurrent']);

// Semester Management (already exists)
Route::get('/director/semesters', [DirectorSemesterController::class, 'index']);
Route::post('/director/semesters/open', [DirectorSemesterController::class, 'open']);
Route::post('/director/semesters/close', [DirectorSemesterController::class, 'close']);
```

## Business Rules

### Year Creation
1. ✅ Name must be unique
2. ✅ Start date < End date
3. ✅ Cannot overlap with existing active year
4. ✅ Automatically creates 2 semesters
5. ✅ S1 starts OPEN, S2 starts CLOSED

### Semester Progression
1. ✅ Only one semester can be OPEN at a time
2. ✅ S2 cannot open until S1 is closed
3. ✅ Cannot close semester without marks
4. ✅ Can reopen closed semesters
5. ✅ Closing S2 marks year as "completed"

### Access Control
1. ✅ Only Director can manage years/semesters
2. ✅ Teachers can only enter marks when semester is OPEN
3. ✅ Students can only see results for CLOSED semesters
4. ✅ All actions are audit-logged

## Status Indicators

### Academic Year Status
- 🔵 **Upcoming**: Future year, not yet started
- 🟢 **Active**: Current year in progress
- ⚫ **Completed**: Past year, both semesters closed

### Semester Status
- 🟢 **OPEN**: Teachers can enter marks
- 🔴 **CLOSED**: Marks locked, students can view
- ⚪ **NOT STARTED**: Waiting for previous semester

## Timeline View

```
Academic Year 2025-2026 [Active]
├── Semester 1 [🟢 OPEN]
│   ├── Opened: Sep 1, 2025
│   ├── Expected Close: Jan 31, 2026
│   └── [Close Semester 1] ──────┐
│                                 │
└── Semester 2 [⚪ NOT STARTED]   │
    ├── Opens after S1 closes ←──┘
    ├── Expected Close: Jun 30, 2026
    └── [Open Semester 2] (disabled)
```

## Dashboard Widgets

### Teacher Dashboard
```jsx
<SemesterWidget
  semester={currentSemester}
  canEnterMarks={semester.status === 'open'}
  deadline={semester.expectedCloseDate}
  daysRemaining={calculateDays(deadline)}
/>
```

### Student Dashboard
```jsx
<SemesterWidget
  semester={currentSemester}
  canViewResults={semester.status === 'closed'}
  resultsAvailable={semester.status === 'closed'}
  estimatedDate={semester.expectedCloseDate}
/>
```

## Notifications

### When S1 Opens
- Email to all teachers: "Semester 1 is now open for mark entry"
- Dashboard notification

### When S1 Closes
- Email to teachers: "Semester 1 is now closed"
- Email to students: "Your Semester 1 results are available"
- Dashboard notifications

### When S2 Opens
- Email to all teachers: "Semester 2 is now open for mark entry"
- Dashboard notification

### When S2 Closes
- Email to teachers: "Semester 2 is now closed"
- Email to students: "Your Semester 2 results are available"
- Email to Director: "Academic year 2025-2026 is complete"

## API Endpoints

```
Academic Years:
GET    /director/academic-years              - List all years
POST   /director/academic-years              - Create new year
GET    /director/academic-years/{id}         - View year details
PUT    /director/academic-years/{id}         - Update year
PUT    /director/academic-years/{id}/current - Set as current
DELETE /director/academic-years/{id}         - Delete year

Semesters:
GET    /director/semesters                   - View semester control
POST   /director/semesters/open              - Open semester
POST   /director/semesters/close             - Close semester
POST   /director/semesters/reopen            - Reopen semester

Dashboard:
GET    /teacher/semester/current             - Get current semester info
GET    /student/semester/current             - Get current semester info
```

## Implementation Priority

### Phase 1: Academic Year Management
1. Create DirectorAcademicYearController
2. Build year CRUD operations
3. Add automatic semester creation
4. Create UI for year management

### Phase 2: Enhanced Semester Control
1. Update DirectorSemesterController
2. Add sequential progression logic
3. Enhance UI with timeline view
4. Add validation rules

### Phase 3: Dashboard Integration
1. Create SemesterWidget component
2. Update Teacher dashboard
3. Update Student dashboard
4. Add countdown timers

### Phase 4: Notifications & Polish
1. Implement email notifications
2. Add audit logging
3. Create reports
4. Performance optimization

## Testing Checklist

- [ ] Create new academic year
- [ ] Verify S1 is OPEN, S2 is CLOSED
- [ ] Teachers can enter marks in S1
- [ ] Students cannot see S1 results
- [ ] Close S1
- [ ] Verify S1 results visible to students
- [ ] Open S2
- [ ] Teachers can enter marks in S2
- [ ] Close S2
- [ ] Verify year marked as "completed"
- [ ] Create next year
- [ ] Verify previous year is "completed"
- [ ] Test dashboard widgets
- [ ] Test notifications

## Success Metrics

✅ Seamless year-to-year progression
✅ Clear semester status for all users
✅ No confusion about mark entry periods
✅ Students see results at right time
✅ Director has full control
✅ System enforces business rules automatically
✅ Audit trail for all actions

## Next Steps

1. Implement Academic Year Management
2. Enhance Semester Control UI
3. Add Dashboard Widgets
4. Test Complete Workflow
5. Deploy to Production
