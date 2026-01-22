# Custom Assessment System - User Guide

## Overview
The custom assessment system allows teachers to create their own assessment structures with multiple components (Test, Project, Assignment, etc.) with custom weights that total 100%.

## Features
- ✅ Create custom assessments with multiple components
- ✅ Set custom weights for each component (must total 100%)
- ✅ Enter marks for each component separately
- ✅ Automatic total score calculation based on weighted components
- ✅ Progress tracking and completion statistics
- ✅ Only numerical scores (0-100), no letter grades

## How to Use

### 1. Access Custom Assessments
- Login as a teacher
- Navigate to "My Assessments" in the sidebar
- Click "Create Assessment" to start

### 2. Create an Assessment
1. **Basic Information:**
   - Select Section (only sections assigned to you)
   - Select Subject (only subjects you teach)
   - Enter Assessment Name (e.g., "Midterm Examination")
   - Choose Semester (1 or 2)

2. **Assessment Components:**
   - Add components like "Test", "Project", "Assignment", "Final"
   - Set weight percentage for each component
   - Add optional descriptions
   - **Important:** Total weight must equal 100%

3. **Example Structure:**
   ```
   Test: 30%
   Project: 25%
   Assignment: 20%
   Final: 25%
   Total: 100%
   ```

### 3. Enter Marks
1. Go to "My Assessments" and click "Enter Marks" on your assessment
2. Enter scores (0-100) for each component for each student
3. Total score is automatically calculated based on weights
4. Save all marks when complete

### 4. View Results
- Assessment status shows completion rate
- View detailed results in the assessment details page
- Students see their component scores and total weighted score

## Technical Details

### Database Structure
- `assessments` table: Main assessment records
- `assessment_components` table: Component definitions with weights
- `marks` table: Student marks with `component_scores` JSON field

### Routes
- `GET /teacher/custom-assessments` - List assessments
- `GET /teacher/custom-assessments/create` - Create form
- `POST /teacher/custom-assessments` - Store assessment
- `GET /teacher/custom-assessments/{id}` - View assessment
- `GET /teacher/custom-assessments/{id}/enter-marks` - Marks entry form
- `POST /teacher/custom-assessments/{id}/store-marks` - Save marks

## Example Workflow
1. Teacher creates "Mathematics Midterm" assessment
2. Adds components: Quiz (20%), Test (30%), Project (25%), Final (25%)
3. System validates total weight = 100%
4. Teacher enters marks for each student for each component
5. System calculates final scores automatically
6. Students see their detailed breakdown and total score

## Benefits
- Flexible assessment structure
- Transparent grading with component breakdown
- Automatic calculations reduce errors
- Progress tracking for teachers
- Detailed feedback for students