# Teacher Assessment Creation - Requirements

## Feature Overview
Add a streamlined assessment creation workflow to the Teacher Dashboard that automatically filters classes and subjects based on teacher assignments, grade levels, and streams (for Grades 11 & 12).

## Location
**Dashboard:** Teacher Dashboard  
**Navigation:** Teacher Dashboard → Assessments → Add Assessment  
**Access:** Teachers only (role-based access control)

## Assessment Creation Flow (Corrected)

### Step 1: Class Selection (First Step)
When a teacher clicks "Add Assessment" from the Teacher Dashboard, the first screen shows **only the classes assigned to that teacher**.

Each class includes:
- **Grade** (9, 10, 11, 12)
- **Section** (A, B, C, etc.)
- **Stream** (for Grades 11 & 12, if applicable - Natural or Social)

### Step 2: Subject Filtering (After Class Selection)
Once a class is selected, subjects are displayed based on the selected class:

**For Grades 9 & 10:**
- Display the common subject list
- No stream selection needed
- All subjects for that grade level are shown

**For Grades 11 & 12:**
- Stream is already known from the class (Natural or Social)
- Display **only subjects for that stream**
- Teacher sees only subjects they teach in that class

### Step 3: Assessment Entry
Teacher enters:
- Assessment name (required)
- Subject (filtered, required)
- Assessment type (required)
- Date (required)
- Total marks (required)
- Description (optional)

### Step 4: Assessment Visibility
The assessment is:
- Linked to the selected class
- Visible only to students in that class
- Not accessible by other classes, grades, or streams

## System Enforcement Rules

1. **Class list is filtered by teacher assignment**
   - Only classes where teacher has active assignments are shown
   
2. **Subject list is filtered by:**
   - Grade level
   - Stream (if applicable for Grades 11 & 12)
   - Teacher's subject assignment for that specific class
   
3. **Teachers cannot manually change class or stream after selection**
   - Class and stream are locked once selected
   - To change, teacher must start over

## User Stories

### US-1: Class Selection (First Step)
**As a** teacher  
**I want to** see only the classes I'm assigned to when creating an assessment  
**So that** I don't accidentally create assessments for classes I don't teach

**Acceptance Criteria:**
- 1.1: When teacher clicks "Add Assessment" from Teacher Dashboard, system displays only classes assigned to that teacher
- 1.2: Each class entry shows: Grade (9, 10, 11, 12), Section, and Stream (if applicable for Grades 11 & 12)
- 1.3: Class list is automatically filtered based on teacher_assignments table
- 1.4: Teacher cannot manually add or select classes not assigned to them
- 1.5: Class selection is the first and mandatory step before subject selection

### US-2: Subject Filtering by Grade and Stream (After Class Selection)
**As a** teacher  
**I want to** see only relevant subjects after selecting a class  
**So that** I can quickly find the subject I need to assess

**Acceptance Criteria:**
- 2.1: Subject selection appears only after class is selected
- 2.2: For Grades 9 & 10: Display common subject list (no stream filtering needed)
- 2.3: For Grades 11 & 12: Stream is already known from the selected class
- 2.4: For Grades 11 & 12: Display only subjects for that stream (Natural or Social)
- 2.5: Subject list shows only subjects the teacher teaches in the selected class
- 2.6: Subject filtering happens automatically based on class selection
- 2.7: Teacher cannot manually override stream-based subject filtering
- 2.8: Teacher cannot change class or stream after selection without starting over

### US-3: Assessment Entry Form
**As a** teacher  
**I want to** enter assessment details in a simple form  
**So that** I can quickly create assessments for my students

**Acceptance Criteria:**
- 3.1: Form includes required fields: Assessment name, Subject (filtered), Assessment type, Date, Total marks
- 3.2: Form includes optional field: Description
- 3.3: Assessment type dropdown shows types configured for the selected class/section/subject
- 3.4: Date field defaults to current date but can be changed
- 3.5: Total marks field accepts positive numbers only
- 3.6: Form validates all required fields before submission

### US-4: Assessment Visibility and Access Control
**As a** teacher  
**I want** assessments to be visible only to the correct class  
**So that** students in other classes don't see assessments not meant for them

**Acceptance Criteria:**
- 4.1: Assessment is linked to the selected class (grade + section + stream if applicable)
- 4.2: Assessment is visible only to students enrolled in that specific class
- 4.3: Students in other classes, grades, or streams cannot access the assessment
- 4.4: Teachers can only view/edit assessments for classes they teach
- 4.5: System enforces access control at database and API level

## Business Rules

### BR-1: Teacher Assignment Enforcement
- Teachers can only create assessments for classes they are assigned to
- Class assignments are managed through the teacher_assignments table
- System must verify teacher assignment before allowing assessment creation

### BR-2: Grade and Stream Logic
- **Grades 9 & 10:** No stream differentiation, all subjects available for that grade
- **Grades 11 & 12:** Stream (Natural/Social) determines available subjects
- Stream is determined by the section assignment (from the selected class), not manually selected by teacher
- Once a class is selected, the stream (if applicable) is locked and cannot be changed

### BR-3: Subject Filtering Rules (Sequential)
- **Step 1:** Teacher selects a class (grade + section + stream if applicable)
- **Step 2:** Subject list is then filtered by:
  1. Grade level (from selected class)
  2. Stream (if applicable - from selected class for Grades 11 & 12)
  3. Teacher's subject assignments for that specific class
- Teachers cannot create assessments for subjects they don't teach in the selected class
- Teachers cannot manually change the class or stream after selection

### BR-4: Assessment Scope
- Each assessment is scoped to: Grade + Section + Subject + Stream (if applicable)
- Assessments cannot be shared across different classes or streams
- Assessment visibility is strictly controlled by class enrollment

## Data Model Requirements

### Required Tables/Relationships
1. **teacher_assignments**: Links teachers to classes and subjects
   - teacher_id
   - grade_id
   - section_id
   - subject_id
   - academic_year_id

2. **assessments**: Stores assessment details
   - name
   - grade_id
   - section_id
   - subject_id
   - assessment_type_id
   - date
   - total_marks
   - description (optional)
   - teacher_id (creator)
   - stream_id (for Grades 11 & 12)

3. **assessment_types**: Pre-configured assessment types
   - name
   - grade_id
   - section_id
   - subject_id
   - weight

4. **streams**: Stream definitions (Natural, Social)
   - name
   - grade_id (11 or 12)

## UI/UX Requirements

### Navigation
- Add "Assessments" menu item to Teacher Dashboard sidebar
- Add "+ Add Assessment" button on Assessments list page
- Breadcrumb: Teacher Dashboard → Assessments → Add Assessment

### Step 1: Class Selection Screen
- Display as cards or list within Teacher Dashboard layout
- Show: Grade, Section, Stream (if applicable for Grades 11 & 12)
- Highlight current academic year
- Sort by grade level (9, 10, 11, 12)
- Use consistent Teacher Dashboard styling
- Clear "Select Class" heading
- No subject selection visible until class is chosen

### Step 2: Subject Selection (After Class Selection)
- Appears after class is selected
- Shows filtered subjects based on:
  - Grade level (from selected class)
  - Stream (if applicable - from selected class)
  - Teacher's assignments for that class
- Display selected class information at top (locked, not editable)
- Option to "Change Class" (starts over from Step 1)

### Step 3: Assessment Form
- Clean, single-page form within Teacher Dashboard
- Shows selected class and subject at top (locked)
- Form fields: Assessment name, Assessment type, Date, Total marks, Description
- Clear field labels and validation messages
- Save and Cancel buttons
- Match existing Teacher Dashboard form patterns

### Step 4: Confirmation
- Show success message with assessment details
- Option to add marks immediately or return to assessment list
- Redirect to Assessments list page after creation

## Technical Constraints

1. **Performance**: Class and subject filtering must happen in < 200ms
2. **Security**: All filtering must happen server-side, not just client-side
3. **Validation**: Both client-side and server-side validation required
4. **Audit**: Log all assessment creation actions with timestamp and teacher ID

## Out of Scope (Future Enhancements)
- Bulk assessment creation
- Assessment templates
- Copying assessments across classes
- Assessment scheduling/publishing dates
- Student self-assessment

## Success Metrics
- Teachers can create an assessment in < 2 minutes
- Zero unauthorized assessment access incidents
- 95% of assessments created without errors
- Teacher satisfaction score > 4/5 for assessment creation workflow

## Dependencies
- Teacher Dashboard must be accessible and functional
- Teacher assignment system must be functional (teacher_assignments table)
- Assessment types must be pre-configured by registrar
- Stream assignments must be set up for Grades 11 & 12
- Subject combination must be configured for all classes
- TeacherLayout component must support new navigation items

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Teacher assigned to wrong class | High | Implement assignment verification workflow |
| Stream misconfiguration | High | Add validation checks during section setup |
| Subject filtering fails | Medium | Implement fallback to show all subjects with warning |
| Performance issues with large datasets | Medium | Add caching for teacher assignments and subjects |

## Questions for Stakeholders
1. Should teachers be able to create assessments for future academic years?
2. What happens to assessments when a teacher is reassigned?
3. Should there be a draft/published status for assessments?
4. Can teachers edit assessments after students have submitted marks?
5. Should there be a notification when a new assessment is created?
