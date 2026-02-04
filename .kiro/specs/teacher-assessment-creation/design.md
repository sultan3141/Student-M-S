# Teacher Assessment Creation - Design Document

## Architecture Overview

This feature adds assessment creation functionality to the Teacher Dashboard with intelligent filtering based on teacher assignments, grade levels, and streams.

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Teacher Dashboard                         │
├─────────────────────────────────────────────────────────────┤
│  Navigation: Assessments → Add Assessment                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              TeacherAssessmentController                     │
├─────────────────────────────────────────────────────────────┤
│  • index() - List assessments                               │
│  • create() - Show create form with filtered data           │
│  • store() - Save assessment                                │
│  • getSubjects() - API for subject filtering                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                                │
├─────────────────────────────────────────────────────────────┤
│  • teacher_assignments (filter classes)                     │
│  • grade_subject (filter subjects by stream)                │
│  • assessment_types (get configured types)                  │
│  • assessments (store new assessments)                      │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Existing Tables (No Changes)
- `teacher_assignments` - Already tracks teacher-class-subject assignments
- `assessment_types` - Already has grade_id, section_id, subject_id
- `grade_subject` - Already has subject combinations per section
- `sections` - Already has stream information

### New Table: `assessments`

```sql
CREATE TABLE assessments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    teacher_id BIGINT NOT NULL,
    grade_id BIGINT NOT NULL,
    section_id BIGINT NOT NULL,
    subject_id BIGINT NOT NULL,
    assessment_type_id BIGINT NOT NULL,
    date DATE NOT NULL,
    total_marks DECIMAL(5,2) NOT NULL,
    description TEXT NULL,
    academic_year_id BIGINT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (grade_id) REFERENCES grades(id),
    FOREIGN KEY (section_id) REFERENCES sections(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (assessment_type_id) REFERENCES assessment_types(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    
    INDEX idx_teacher_class (teacher_id, grade_id, section_id),
    INDEX idx_subject_date (subject_id, date)
);
```

## Backend Implementation

### Controller: `TeacherAssessmentController`

**Location:** `app/Http/Controllers/TeacherAssessmentController.php`

```php
class TeacherAssessmentController extends Controller
{
    // List all assessments for the logged-in teacher
    public function index()
    {
        $teacher = auth()->user()->teacher;
        $assessments = Assessment::with(['grade', 'section', 'subject', 'assessmentType'])
            ->where('teacher_id', $teacher->id)
            ->latest()
            ->paginate(15);
            
        return Inertia::render('Teacher/Assessments/Index', [
            'assessments' => $assessments
        ]);
    }
    
    // Show create form with filtered classes
    public function create()
    {
        $teacher = auth()->user()->teacher;
        $academicYear = AcademicYear::where('is_current', true)->first();
        
        // Get classes assigned to this teacher
        $assignments = TeacherAssignment::with(['grade', 'section', 'subject'])
            ->where('teacher_id', $teacher->id)
            ->where('academic_year_id', $academicYear->id)
            ->get()
            ->groupBy(function($item) {
                return $item->grade_id . '_' . $item->section_id;
            })
            ->map(function($group) {
                $first = $group->first();
                return [
                    'grade_id' => $first->grade_id,
                    'grade_name' => $first->grade->name,
                    'section_id' => $first->section_id,
                    'section_name' => $first->section->name,
                    'stream' => $first->section->stream,
                ];
            })
            ->values();
            
        return Inertia::render('Teacher/Assessments/Create', [
            'classes' => $assignments,
            'academicYear' => $academicYear
        ]);
    }
    
    // Get subjects for selected class
    public function getSubjects(Request $request)
    {
        $teacher = auth()->user()->teacher;
        $gradeId = $request->grade_id;
        $sectionId = $request->section_id;
        
        // Get subjects this teacher teaches in this class
        $subjects = TeacherAssignment::with('subject')
            ->where('teacher_id', $teacher->id)
            ->where('grade_id', $gradeId)
            ->where('section_id', $sectionId)
            ->get()
            ->pluck('subject')
            ->unique('id')
            ->values();
            
        return response()->json($subjects);
    }
    
    // Get assessment types for selected subject
    public function getAssessmentTypes(Request $request)
    {
        $types = AssessmentType::where('grade_id', $request->grade_id)
            ->where('section_id', $request->section_id)
            ->where('subject_id', $request->subject_id)
            ->get();
            
        return response()->json($types);
    }
    
    // Store new assessment
    public function store(Request $request)
    {
        $teacher = auth()->user()->teacher;
        $academicYear = AcademicYear::where('is_current', true)->first();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
            'subject_id' => 'required|exists:subjects,id',
            'assessment_type_id' => 'required|exists:assessment_types,id',
            'date' => 'required|date',
            'total_marks' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);
        
        // Verify teacher is assigned to this class/subject
        $hasAssignment = TeacherAssignment::where('teacher_id', $teacher->id)
            ->where('grade_id', $validated['grade_id'])
            ->where('section_id', $validated['section_id'])
            ->where('subject_id', $validated['subject_id'])
            ->exists();
            
        if (!$hasAssignment) {
            return back()->withErrors(['error' => 'You are not assigned to teach this subject in this class.']);
        }
        
        $assessment = Assessment::create([
            ...$validated,
            'teacher_id' => $teacher->id,
            'academic_year_id' => $academicYear->id,
        ]);
        
        return redirect()->route('teacher.assessments.index')
            ->with('success', 'Assessment created successfully!');
    }
}
```

### Model: `Assessment`

**Location:** `app/Models/Assessment.php`

```php
class Assessment extends Model
{
    protected $fillable = [
        'name',
        'teacher_id',
        'grade_id',
        'section_id',
        'subject_id',
        'assessment_type_id',
        'date',
        'total_marks',
        'description',
        'academic_year_id',
    ];
    
    protected $casts = [
        'date' => 'date',
        'total_marks' => 'decimal:2',
    ];
    
    // Relationships
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
    
    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }
    
    public function section()
    {
        return $this->belongsTo(Section::class);
    }
    
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
    
    public function assessmentType()
    {
        return $this->belongsTo(AssessmentType::class);
    }
    
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }
    
    public function marks()
    {
        return $this->hasMany(Mark::class);
    }
    
    // Scopes
    public function scopeForTeacher($query, $teacherId)
    {
        return $query->where('teacher_id', $teacherId);
    }
    
    public function scopeForClass($query, $gradeId, $sectionId)
    {
        return $query->where('grade_id', $gradeId)
                     ->where('section_id', $sectionId);
    }
}
```

## Frontend Implementation

### Component Structure

```
resources/js/Pages/Teacher/Assessments/
├── Index.jsx           # List all assessments
├── Create.jsx          # Create assessment form
└── Show.jsx            # View assessment details (future)
```

### Create Assessment Form

**Location:** `resources/js/Pages/Teacher/Assessments/Create.jsx`

```jsx
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ classes, academicYear }) {
    const [subjects, setSubjects] = useState([]);
    const [assessmentTypes, setAssessmentTypes] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        grade_id: '',
        section_id: '',
        subject_id: '',
        assessment_type_id: '',
        date: new Date().toISOString().split('T')[0],
        total_marks: '',
        description: '',
    });
    
    const handleClassSelect = async (classData) => {
        setSelectedClass(classData);
        setData({
            ...data,
            grade_id: classData.grade_id,
            section_id: classData.section_id,
            subject_id: '',
            assessment_type_id: '',
        });
        
        // Fetch subjects for this class
        const response = await fetch(
            `/teacher/assessments/subjects?grade_id=${classData.grade_id}&section_id=${classData.section_id}`
        );
        const subjectsData = await response.json();
        setSubjects(subjectsData);
        setAssessmentTypes([]);
    };
    
    const handleSubjectChange = async (subjectId) => {
        setData('subject_id', subjectId);
        setData('assessment_type_id', '');
        
        // Fetch assessment types for this subject
        const response = await fetch(
            `/teacher/assessments/types?grade_id=${data.grade_id}&section_id=${data.section_id}&subject_id=${subjectId}`
        );
        const typesData = await response.json();
        setAssessmentTypes(typesData);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teacher.assessments.store'));
    };
    
    return (
        <TeacherLayout>
            <Head title="Create Assessment" />
            
            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold mb-6">Create Assessment</h1>
                    
                    {!selectedClass ? (
                        // Step 1: Class Selection
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">Select Class</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {classes.map((cls) => (
                                    <button
                                        key={`${cls.grade_id}_${cls.section_id}`}
                                        onClick={() => handleClassSelect(cls)}
                                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition"
                                    >
                                        <div className="font-semibold text-lg">
                                            {cls.grade_name} - Section {cls.section_name}
                                        </div>
                                        {cls.stream && (
                                            <div className="text-sm text-gray-600 mt-1">
                                                Stream: {cls.stream}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Step 2: Assessment Form
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="mb-4 flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold">Assessment Details</h2>
                                    <p className="text-sm text-gray-600">
                                        {selectedClass.grade_name} - Section {selectedClass.section_name}
                                        {selectedClass.stream && ` (${selectedClass.stream})`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedClass(null);
                                        setSubjects([]);
                                        setAssessmentTypes([]);
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Change Class
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Assessment Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assessment Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="e.g., Chapter 1 Quiz"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>
                                
                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.subject_id}
                                        onChange={e => handleSubjectChange(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                        required
                                    >
                                        <option value="">-- Select Subject --</option>
                                        {subjects.map(subject => (
                                            <option key={subject.id} value={subject.id}>
                                                {subject.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.subject_id && <p className="mt-1 text-sm text-red-600">{errors.subject_id}</p>}
                                </div>
                                
                                {/* Assessment Type */}
                                {assessmentTypes.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Assessment Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.assessment_type_id}
                                            onChange={e => setData('assessment_type_id', e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            required
                                        >
                                            <option value="">-- Select Type --</option>
                                            {assessmentTypes.map(type => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name} ({type.weight}%)
                                                </option>
                                            ))}
                                        </select>
                                        {errors.assessment_type_id && <p className="mt-1 text-sm text-red-600">{errors.assessment_type_id}</p>}
                                    </div>
                                )}
                                
                                {/* Date and Total Marks */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={data.date}
                                            onChange={e => setData('date', e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            required
                                        />
                                        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Total Marks <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.total_marks}
                                            onChange={e => setData('total_marks', e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg"
                                            placeholder="100"
                                            required
                                        />
                                        {errors.total_marks && <p className="mt-1 text-sm text-red-600">{errors.total_marks}</p>}
                                    </div>
                                </div>
                                
                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows="3"
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="Additional notes about this assessment..."
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>
                                
                                {/* Submit Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {processing ? 'Creating...' : 'Create Assessment'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.visit(route('teacher.assessments.index'))}
                                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </TeacherLayout>
    );
}
```

## Routes

**Location:** `routes/web.php`

```php
// Teacher Assessment Routes
Route::prefix('teacher')->middleware(['auth', 'role:teacher'])->group(function () {
    Route::get('/assessments', [TeacherAssessmentController::class, 'index'])
        ->name('teacher.assessments.index');
    Route::get('/assessments/create', [TeacherAssessmentController::class, 'create'])
        ->name('teacher.assessments.create');
    Route::post('/assessments', [TeacherAssessmentController::class, 'store'])
        ->name('teacher.assessments.store');
    Route::get('/assessments/subjects', [TeacherAssessmentController::class, 'getSubjects'])
        ->name('teacher.assessments.subjects');
    Route::get('/assessments/types', [TeacherAssessmentController::class, 'getAssessmentTypes'])
        ->name('teacher.assessments.types');
});
```

## Navigation Update

**Location:** `resources/js/Layouts/TeacherLayout.jsx`

Add to navigation array:

```jsx
{ 
    name: 'Assessments', 
    href: route('teacher.assessments.index'), 
    icon: ClipboardDocumentListIcon, 
    active: url.startsWith('/teacher/assessments') 
}
```

## Security Considerations

1. **Authorization**: Verify teacher assignment before allowing assessment creation
2. **Validation**: Server-side validation of all inputs
3. **Access Control**: Teachers can only see/edit their own assessments
4. **SQL Injection**: Use Eloquent ORM and parameter binding
5. **XSS Protection**: Laravel's Blade/Inertia automatically escapes output

## Performance Optimization

1. **Eager Loading**: Load relationships to avoid N+1 queries
2. **Caching**: Cache teacher assignments for current academic year
3. **Indexing**: Database indexes on frequently queried columns
4. **Pagination**: Limit assessment list to 15 per page

## Testing Strategy

### Unit Tests
- Assessment model relationships
- Validation rules
- Scope methods

### Feature Tests
- Teacher can view only their assessments
- Teacher can create assessment for assigned class
- Teacher cannot create assessment for unassigned class
- Subject filtering works correctly for streams
- Assessment types filter correctly

### Integration Tests
- Complete assessment creation workflow
- Class selection → Subject selection → Form submission
- API endpoints return correct filtered data

## Rollout Plan

1. **Phase 1**: Database migration and model creation
2. **Phase 2**: Backend controller and routes
3. **Phase 3**: Frontend components
4. **Phase 4**: Navigation integration
5. **Phase 5**: Testing and bug fixes
6. **Phase 6**: Production deployment

## Monitoring

- Track assessment creation success rate
- Monitor API response times
- Log authorization failures
- Track user engagement with feature
