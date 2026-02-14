# Two Separate Pages - Assessment Workflow

## 🎯 Understanding the System

The assessment system has **TWO SEPARATE PAGES** that work together:

```
┌─────────────────────────────────────────────────────────────┐
│                    ASSESSMENT MANAGER                        │
│              /teacher/assessments/unified                    │
│                                                              │
│  Purpose: CREATE, EDIT, DELETE assessments                  │
│  Actions:                                                    │
│    ✓ Create new assessment (name, max marks, type)         │
│    ✓ Edit assessment details                                │
│    ✓ Delete assessment                                      │
│    ✓ View all assessments in grid                          │
│    ✓ (Optional) Enter marks directly                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    (Assessments saved to database)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     DECLARE RESULT                           │
│              /teacher/declare-result                         │
│                                                              │
│  Purpose: ENTER MARKS using assessments                     │
│  Actions:                                                    │
│    ✓ Select students (Step 1)                              │
│    ✓ Select subject (Step 2)                               │
│    ✓ Enter marks for assessments (Step 3)                  │
│    ✓ Save results with audit trail                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Step-by-Step Workflow

### STEP 1: Create Assessments (Assessment Manager)

**Page**: Assessment Manager (`/teacher/assessments/unified`)

1. Select Grade: "Grade 10"
2. Select Section: "Section A"
3. Select Subject: "Mathematics"
4. Click "New Assessment"
5. Create assessments:
   - Assessment 1: "Unit Test 1" (Max: 10 marks)
   - Assessment 2: "Unit Test 2" (Max: 10 marks)
   - Assessment 3: "Mid Term" (Max: 20 marks)
   - Assessment 4: "Final Exam" (Max: 60 marks)
6. Assessments are now saved in database

### STEP 2: Enter Marks (Declare Result)

**Page**: Declare Result (`/teacher/declare-result`)

1. Select Grade: "Grade 10" (SAME as Step 1)
2. Select Section: "Section A" (SAME as Step 1)
3. Select Subject: "Mathematics" (SAME as Step 1)
4. System automatically loads the 4 assessments created in Step 1
5. Select students
6. Enter marks for each assessment
7. Save results

## 🔗 How They Connect

### Database Connection
Both pages use the **SAME** database tables:
- `assessments` table - stores assessment definitions
- `marks` table - stores student marks

### Query Logic
```php
// Both pages query assessments with:
Assessment::where('grade_id', $gradeId)
    ->where('section_id', $sectionId)
    ->where('subject_id', $subjectId)
    ->where('academic_year_id', $currentYear)
    ->get();
```

### Key Point
When you select the **SAME** Grade + Section + Subject in both pages, you see the **SAME** assessments!

## 🎨 Visual Comparison

### Assessment Manager Page
```
┌────────────────────────────────────────────────────────┐
│ ASSESSMENT MANAGER                                      │
├────────────────────────────────────────────────────────┤
│ Grade: [Grade 10 ▼] Section: [A ▼] Subject: [Math ▼] │
│                                    [+ New Assessment]   │
├────────────────────────────────────────────────────────┤
│ Student      │ Unit Test 1 │ Unit Test 2 │ Mid Term  │
│              │   (Max: 10) │   (Max: 10) │ (Max: 20) │
│              │   [✏️ Edit]  │   [✏️ Edit]  │  [✏️ Edit] │
│              │   [🗑️ Del]   │   [🗑️ Del]   │  [🗑️ Del]  │
├──────────────┼─────────────┼─────────────┼───────────┤
│ John Doe     │    [___]    │    [___]    │   [___]   │
│ Jane Smith   │    [___]    │    [___]    │   [___]   │
└────────────────────────────────────────────────────────┘
```

### Declare Result Page
```
┌────────────────────────────────────────────────────────┐
│ DECLARE RESULT                                          │
├────────────────────────────────────────────────────────┤
│ Grade: [Grade 10 ▼] Section: [A ▼] Subject: [Math ▼] │
├────────────────────────────────────────────────────────┤
│ Step 1: Select Students                                │
│ ☑ John Doe                                             │
│ ☑ Jane Smith                                           │
│                                    [Continue →]         │
├────────────────────────────────────────────────────────┤
│ Step 2: Select Subject                                 │
│ [Mathematics] [English] [Science]                      │
├────────────────────────────────────────────────────────┤
│ Step 3: Enter Marks                                    │
│ Assessments loaded from Assessment Manager:            │
│ - Unit Test 1 (Max: 10)                               │
│ - Unit Test 2 (Max: 10)                               │
│ - Mid Term (Max: 20)                                  │
│                                                         │
│ John Doe:  [8] [9] [15]                               │
│ Jane Smith: [9] [8] [18]                              │
│                                    [Save Results]       │
└────────────────────────────────────────────────────────┘
```

## ❓ Common Questions

### Q: Can I enter marks in Assessment Manager?
**A**: Yes! The Assessment Manager has a mark entry grid, but the Declare Result page provides a better workflow with the 3-step wizard.

### Q: Do I need to create assessments every time?
**A**: No! Once created in Assessment Manager, assessments are saved permanently. You only create them once per academic year.

### Q: What if I don't see my assessments in Declare Result?
**A**: Make sure you selected the SAME Grade, Section, and Subject in both pages. Also check that you're in the correct academic year.

### Q: Can I edit assessments after entering marks?
**A**: Yes, but be careful! Editing max_score might affect existing marks. It's better to create assessments correctly first.

### Q: Which page should I use for daily work?
**A**: 
- **Assessment Manager**: Use at the START of semester to set up assessments
- **Declare Result**: Use REGULARLY to enter student marks

## 🚀 Quick Start Guide

### First Time Setup (Start of Semester)
1. Go to **Assessment Manager**
2. Create all assessments for the semester
3. Done! Assessments are ready

### Daily/Weekly Work (Throughout Semester)
1. Go to **Declare Result**
2. Select class and subject
3. Enter marks for students
4. Save results
5. Repeat as needed

### Editing Assessments (Rare)
1. Go to **Assessment Manager**
2. Click edit button on assessment
3. Make changes
4. Save

## 📊 Data Flow

```
Teacher Creates Assessment
         ↓
Assessment Manager Page
         ↓
Save to Database (assessments table)
         ↓
[Assessment stored with: grade_id, section_id, subject_id]
         ↓
Teacher Opens Declare Result
         ↓
Declare Result Page
         ↓
Query Database (same grade_id, section_id, subject_id)
         ↓
Display Assessments
         ↓
Teacher Enters Marks
         ↓
Save to Database (marks table with assessment_id)
         ↓
Done!
```

## ✅ Summary

| Feature | Assessment Manager | Declare Result |
|---------|-------------------|----------------|
| **URL** | `/teacher/assessments/unified` | `/teacher/declare-result` |
| **Purpose** | Manage assessments | Enter marks |
| **Create Assessment** | ✅ Yes | ❌ No |
| **Edit Assessment** | ✅ Yes | ❌ No |
| **Delete Assessment** | ✅ Yes | ❌ No |
| **Enter Marks** | ✅ Yes (optional) | ✅ Yes (primary) |
| **3-Step Wizard** | ❌ No | ✅ Yes |
| **When to Use** | Start of semester | Throughout semester |

---

**Remember**: Two separate pages, one connected system! 🎯
