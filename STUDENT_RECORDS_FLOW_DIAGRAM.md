# Student Academic Records - Visual Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     STUDENT ACADEMIC RECORDS                     │
│                    Hierarchical Navigation System                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  LEVEL 1: GRADE SELECTION                                        │
│  Route: /student/academic/semesters                              │
│  Controller: SemesterRecordController@index                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ User clicks grade card
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  LEVEL 2: SEMESTER SELECTION                                     │
│  Same route (state-based navigation)                             │
│  Component state: selectedGrade = gradeObject                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ User clicks semester card
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  LEVEL 3: DETAILED REPORT CARD                                   │
│  Route: /student/academic/semesters/{sem}/{year}                 │
│  Controller: SemesterRecordController@show                       │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────┐
│   Student    │
│   Logs In    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  Controller: SemesterRecordController@index                   │
│                                                               │
│  1. Get authenticated student                                │
│  2. Fetch registrations (grade history)                      │
│  3. For each registration:                                   │
│     ├─ Check for marks in Semester 1                         │
│     ├─ Check for marks in Semester 2                         │
│     ├─ Calculate averages if complete                        │
│     ├─ Calculate ranks if complete                           │
│     └─ Get semester status                                   │
│  4. Filter out grades with no data                           │
│  5. Return history array                                     │
└──────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  Frontend: Student/SemesterRecord/Index.jsx                  │
│                                                               │
│  State: selectedGrade = null                                 │
│                                                               │
│  Render: Grade cards in grid layout                          │
│  ┌────────┐  ┌────────┐  ┌────────┐                         │
│  │Grade 9 │  │Grade 10│  │Grade 11│                         │
│  │2023-24 │  │2024-25 │  │2025-26 │                         │
│  └────────┘  └────────┘  └────────┘                         │
└──────────────────────────────────────────────────────────────┘
       │
       │ User clicks "Grade 10" card
       ▼
┌──────────────────────────────────────────────────────────────┐
│  Frontend: State Update                                       │
│                                                               │
│  setSelectedGrade(gradeObject)                               │
│  State: selectedGrade = { grade, year, semesters }           │
└──────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  Frontend: Re-render with Semester View                      │
│                                                               │
│  Render: Semester cards for selected grade                   │
│  ┌─────────────┐  ┌─────────────┐                           │
│  │ Semester 1  │  │ Semester 2  │                           │
│  │ Avg: 85.5%  │  │ Avg: 87.2%  │                           │
│  │ Rank: #3/45 │  │ Rank: #2/45 │                           │
│  │ [Finalized] │  │ [Active]    │                           │
│  └─────────────┘  └─────────────┘                           │
│                                                               │
│  [← Back] button visible                                     │
└──────────────────────────────────────────────────────────────┘
       │
       │ User clicks "Semester 1" card
       ▼
┌──────────────────────────────────────────────────────────────┐
│  Navigation: Link to detailed report                          │
│                                                               │
│  route('student.academic.semester.show', {                   │
│    semester: 1,                                              │
│    academicYear: 2024                                        │
│  })                                                          │
└──────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  Controller: SemesterRecordController@show                    │
│                                                               │
│  1. Validate student and academic year                       │
│  2. Get semester status                                      │
│  3. Fetch all subjects for grade/stream                      │
│  4. Get all assessments for semester                         │
│  5. Get all marks for student                                │
│  6. Build subject records:                                   │
│     ├─ Link marks to assessments                             │
│     ├─ Include orphaned marks                                │
│     ├─ Get teacher names                                     │
│     ├─ Calculate totals and averages                         │
│     └─ Count graded vs total assessments                     │
│  7. Calculate semester average                               │
│  8. Calculate class rank (with caching)                      │
│  9. Return comprehensive report data                         │
└──────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  Frontend: Student/SemesterRecord/Show.jsx                   │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Header: Semester 1 Report - 2024-2025                  │  │
│  │ [← Back to All Semesters]                              │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ Semester Avg │ │  Class Rank  │ │Total Credits │        │
│  │    85.5%     │ │   #3 / 45    │ │     24       │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Subject Performance Table                              │  │
│  ├────────────┬──────────┬──────────────┬──────────────┤  │
│  │ Subject    │ Score    │ Teacher      │ Actions      │  │
│  ├────────────┼──────────┼──────────────┼──────────────┤  │
│  │ Math       │ 170/200  │ John Doe     │ [View]       │  │
│  │ Physics    │ 85/100   │ Jane Smith   │ [View]       │  │
│  │ Chemistry  │ 90/100   │ Bob Johnson  │ [View]       │  │
│  └────────────┴──────────┴──────────────┴──────────────┘  │
└──────────────────────────────────────────────────────────────┘
       │
       │ User clicks "View Details" on Math
       ▼
┌──────────────────────────────────────────────────────────────┐
│  Modal: Assessment Details                                    │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Mathematics (MATH101) - 85% Average                    │  │
│  ├────────────────────┬──────────┬──────────────────────┤  │
│  │ Assessment         │ Max Score│ Your Score           │  │
│  ├────────────────────┼──────────┼──────────────────────┤  │
│  │ Midterm Exam       │   100    │        85            │  │
│  │ Quiz 1             │    50    │        45            │  │
│  │ Assignment 1       │    50    │        40            │  │
│  └────────────────────┴──────────┴──────────────────────┘  │
│                                                               │
│  [Done]                                                      │
└──────────────────────────────────────────────────────────────┘
```

## Database Query Flow

```
┌─────────────────────────────────────────────────────────────┐
│  INDEX METHOD - Grade Selection Data                         │
└─────────────────────────────────────────────────────────────┘

Student
  └─> Registrations (where student_id = X)
       ├─> Grade (via grade_id)
       ├─> AcademicYear (via academic_year_id)
       ├─> Section (via section_id)
       └─> For each registration:
            ├─> Marks (where student_id, academic_year_id, grade_id, semester)
            ├─> SemesterPeriod (where academic_year_id, semester)
            └─> Calculate rank:
                 └─> Marks (where section_id, semester, academic_year_id)
                      └─> Group by student_id
                           └─> Calculate averages
                                └─> Sort and find position

┌─────────────────────────────────────────────────────────────┐
│  SHOW METHOD - Detailed Report Data                          │
└─────────────────────────────────────────────────────────────┘

Student
  ├─> Grade (via grade_id)
  ├─> Section (via section_id)
  └─> Stream (via stream_id, optional)

Subjects (where grade_id, stream_id)
  └─> For each subject:
       ├─> Assessments (where grade_id, section_id, semester, academic_year_id)
       ├─> Marks (where student_id, subject_id, semester, academic_year_id)
       └─> TeacherAssignment (where section_id, subject_id, academic_year_id)
            └─> Teacher
                 └─> User (teacher name)

Ranking Calculation (Cached):
  └─> Students (where section_id)
       └─> Marks (where student_id IN section_students, semester, academic_year_id)
            └─> Group by student_id, subject_id
                 └─> Calculate subject percentages
                      └─> Average percentages
                           └─> Sort descending
                                └─> Find student position
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│  React Component State                                       │
└─────────────────────────────────────────────────────────────┘

Initial State:
  selectedGrade = null

User Action: Click Grade Card
  │
  ├─> setSelectedGrade(gradeObject)
  │
  └─> Component Re-renders
       │
       └─> Conditional Rendering:
            if (!selectedGrade) {
              // Show Grade Selection
              return <GradeCards />
            } else {
              // Show Semester Selection
              return <SemesterCards />
            }

User Action: Click Back Button
  │
  ├─> setSelectedGrade(null)
  │
  └─> Component Re-renders
       │
       └─> Shows Grade Selection again

User Action: Click Semester Card
  │
  └─> Navigate to new route
       │
       └─> New page load (Show.jsx)
```

## Caching Strategy

```
┌─────────────────────────────────────────────────────────────┐
│  Ranking Cache Flow                                          │
└─────────────────────────────────────────────────────────────┘

Request for Rank:
  │
  ├─> Check Cache
  │    Key: "section_rankings_{sectionId}_{semester}_{yearId}"
  │    TTL: 5 minutes
  │
  ├─> Cache Hit?
  │    ├─> YES: Return cached rankings
  │    │         └─> Find student position
  │    │              └─> Return rank
  │    │
  │    └─> NO: Calculate rankings
  │             ├─> Query all students in section
  │             ├─> Get marks for all students
  │             ├─> Calculate averages
  │             ├─> Sort by average
  │             ├─> Store in cache (5 min)
  │             └─> Return rank

Mark Update Event:
  │
  └─> Invalidate Cache
       │
       └─> cache()->forget("section_rankings_...")
            │
            └─> Next request will recalculate
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Error Scenarios                                             │
└─────────────────────────────────────────────────────────────┘

No Student Profile:
  └─> Redirect to dashboard with error message

No Registrations:
  └─> Show empty state component
       "No Records Found"

No Marks for Semester:
  └─> Show semester with:
       ├─> Average: 0
       ├─> Rank: "-"
       └─> Status indicator

Invalid Academic Year:
  └─> Redirect to semester list with error

Missing Teacher Assignment:
  └─> Show "Not Assigned" in teacher column

Incomplete Results:
  └─> Show partial data with indicators:
       ├─> "X/Y graded" badge
       └─> Rank shows as "-"
```

## Performance Optimization Points

```
┌─────────────────────────────────────────────────────────────┐
│  Optimization Strategy                                       │
└─────────────────────────────────────────────────────────────┘

1. Eager Loading:
   ├─> with(['grade', 'section', 'academicYear'])
   └─> Reduces N+1 queries

2. Query Filtering:
   ├─> Only fetch relevant semesters
   └─> Filter by student_id early

3. Caching:
   ├─> Rankings cached per section
   └─> 5-minute TTL balances freshness vs performance

4. Frontend Optimization:
   ├─> Memoized components (React.memo)
   ├─> Conditional rendering
   └─> Lazy state updates

5. Database Indexes:
   ├─> Composite index on marks (student_id, academic_year_id, semester)
   ├─> Index on registrations (student_id, academic_year_id)
   └─> Index on assessments (grade_id, section_id, semester)

6. Data Aggregation:
   ├─> Group by operations in database
   └─> Reduce data transfer to frontend
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Access Control                                              │
└─────────────────────────────────────────────────────────────┘

Request:
  │
  ├─> Authentication Check
  │    └─> Middleware: 'auth'
  │         ├─> Valid session?
  │         │    ├─> YES: Continue
  │         │    └─> NO: Redirect to login
  │
  ├─> Authorization Check
  │    └─> Middleware: 'role:student'
  │         ├─> Has student role?
  │         │    ├─> YES: Continue
  │         │    └─> NO: 403 Forbidden
  │
  └─> Data Isolation
       └─> Controller: auth()->user()->student
            └─> Only fetch data for authenticated student
                 └─> No access to other students' data
```
