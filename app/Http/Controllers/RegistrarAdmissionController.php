<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use App\Models\Grade;
use App\Models\Section;
use App\Models\Subject;
use App\Models\Stream;
use App\Models\AcademicYear;
use App\Models\Teacher;
use App\Models\TeacherAssignment;
use App\Models\AssessmentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RegistrarAdmissionController extends Controller
{
    // Removing redundant create and store methods as they are handled by RegistrarStudentController

    private function generateStudentId()
    {
        $year = date('y'); // 2 digits (e.g., 26 for 2026)

        // Format: SEQUENCE/YY (e.g., 0001/26)
        $lastStudent = Student::where('student_id', 'like', "%/$year")
            ->orderBy('id', 'desc')
            ->first();

        $nextSeq = 1;
        if ($lastStudent) {
            $parts = explode('/', $lastStudent->student_id);
            if (count($parts) === 2) {
                $nextSeq = intval($parts[0]) + 1;
            }
        }

        return str_pad($nextSeq, 4, '0', STR_PAD_LEFT) . '/' . $year;
    }

    // View All Students
    public function index()
    {
        try {
            $students = Student::with(['user', 'grade', 'section'])
                ->latest()
                ->paginate(10);

            return Inertia::render('Registrar/Admission/Index', [
                'students' => $students,
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to load students: ' . $e->getMessage()]);
        }
    }

    // Show Create Form
    public function create()
    {
        $grades = Grade::with('sections')->get();

        return Inertia::render('Registrar/Admission/Create', [
            'grades' => $grades,
        ]);
    }

    // Store New Student with Auto-Assignment
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'grade_id' => 'required|exists:grades,id',
            'gender' => 'required|in:Male,Female',
            'dob' => 'required|date',
            'previous_school' => 'nullable|string|max:255',
            'photo' => 'nullable|image|max:2048',
        ]);

        DB::beginTransaction();
        try {
            // 1. Auto-assign section based on grade, gender, and capacity
            $section = $this->autoAssignSection($validated['grade_id'], $validated['gender']);

            // 2. Generate student credentials
            $studentId = $this->generateStudentId();
            $username = $this->generateUsername($validated['full_name']);
            $email = $this->generateEmail($validated['full_name']);

            // 3. Create user account
            $user = User::create([
                'name' => $validated['full_name'],
                'username' => $username,
                'email' => $email,
                'password' => Hash::make('password'),
            ]);
            $user->assignRole('student');

            // 4. Handle photo upload if provided
            $photoPath = null;
            if ($request->hasFile('photo')) {
                $photoPath = $request->file('photo')->store('student-photos', 'public');
            }

            // 5. Create student record
            $student = Student::create([
                'user_id' => $user->id,
                'student_id' => $studentId,
                'grade_id' => $validated['grade_id'],
                'section_id' => $section->id,
                'gender' => $validated['gender'],
                'dob' => $validated['dob'],
            ]);

            DB::commit();

            return redirect()->route('registrar.admission.index')->with('success', 
                "Student admitted successfully! Roll ID: {$studentId}, Section: {$section->name}");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()->withErrors(['error' => 'Failed to admit student: ' . $e->getMessage()]);
        }
    }

    // Auto-assign section based on grade, gender, and capacity (with random selection)
    private function autoAssignSection($gradeId, $gender)
    {
        // Get all sections for this grade with current student count
        $sections = Section::where('grade_id', $gradeId)
            ->withCount('students')
            ->get();

        if ($sections->isEmpty()) {
            throw new \Exception("No sections available for this grade. Please create a section first.");
        }

        // Priority 1: Gender-specific sections that match student gender
        $genderSpecificSections = $sections->filter(function($section) use ($gender) {
            return $section->gender === $gender && $section->students_count < $section->capacity;
        });

        if ($genderSpecificSections->isNotEmpty()) {
            return $genderSpecificSections->random(); // Random selection
        }

        // Priority 2: Mixed sections with available capacity
        $mixedSections = $sections->filter(function($section) {
            return $section->gender === 'Mixed' && $section->students_count < $section->capacity;
        });

        if ($mixedSections->isNotEmpty()) {
            return $mixedSections->random(); // Random selection
        }

        // Priority 3: Any section with available capacity
        $availableSections = $sections->filter(function($section) {
            return $section->students_count < $section->capacity;
        });

        if ($availableSections->isNotEmpty()) {
            return $availableSections->random(); // Random selection
        }

        // No sections with available capacity
        throw new \Exception("All sections for this grade are at full capacity. Please increase section capacity or create a new section.");
    }

    private function generateUsername($fullName)
    {
        $parts = explode(' ', strtolower(trim($fullName)));
        $base = $parts[0] . (isset($parts[1]) ? '.' . $parts[1] : '');
        $base = preg_replace('/[^a-z0-9.]/', '', $base);

        $count = User::where('username', 'like', "$base%")->count();
        return $count > 0 ? "$base" . ($count + 1) : $base;
    }

    private function generateEmail($fullName)
    {
        $username = $this->generateUsername($fullName);
        return $username . '@student.ipsms.edu';
    }

    // Edit Student
    public function edit($id)
    {
        $student = Student::with(['user', 'grade', 'section'])->findOrFail($id);
        $grades = Grade::with('sections')->get();

        return Inertia::render('Registrar/Admission/Edit', [
            'student' => $student,
            'grades' => $grades,
            'streams' => \App\Models\Stream::select('id', 'name')->get(),
        ]);
    }

    // Update Student
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
            'gender' => 'required|in:Male,Female',
            'dob' => 'required|date',
            'stream_id' => ['nullable', function ($attribute, $value, $fail) use ($request) {
                $grade = Grade::find($request->grade_id);
                $isGrade11or12 = $grade && (str_contains($grade->name, '11') || str_contains($grade->name, '12'));
                if ($isGrade11or12 && !$value) {
                    $fail('Stream selection is required for Grade 11 and 12 students.');
                }
            }],
        ]);

        DB::beginTransaction();
        try {
            $student->user->update(['name' => $validated['full_name']]);
            $student->update([
                'grade_id' => $validated['grade_id'],
                'section_id' => $validated['section_id'],
                'gender' => $validated['gender'],
                'dob' => $validated['dob'],
                'stream_id' => $validated['stream_id'] ?? null,
            ]);

            DB::commit();
            return redirect()->route('registrar.admission.index')->with('success', 'Student updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update student: ' . $e->getMessage()]);
        }
    }

    // Delete Student
    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        
        DB::beginTransaction();
        try {
            $user = $student->user;
            $student->delete();
            $user->delete();

            DB::commit();
            return redirect()->route('registrar.admission.index')->with('success', 'Student deleted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to delete student: ' . $e->getMessage()]);
        }
    }

    // Manage Classes
    public function manageClasses()
    {
        $sections = Section::with('grade')->latest()->paginate(10);

        return Inertia::render('Registrar/Admission/ManageClasses', [
            'sections' => $sections,
        ]);
    }

    // Create Class Form
    public function createClass()
    {
        $grades = Grade::all();
        
        return Inertia::render('Registrar/Admission/CreateClass', [
            'grades' => $grades,
            'streams' => \App\Models\Stream::select('id', 'name')->get(),
        ]);
    }

    // Store New Class
    public function storeClass(Request $request)
    {
        $validated = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('sections')->where(function ($query) use ($request) {
                    return $query->where('grade_id', $request->grade_id);
                }),
            ],
            'gender' => 'nullable|in:Mixed,Male,Female',
            'capacity' => 'required|integer|min:1',
            'stream_id' => [
                'nullable',
                function ($attribute, $value, $fail) use ($request) {
                    $grade = Grade::find($request->grade_id);
                    $isGrade11or12 = $grade && (str_contains($grade->name, '11') || str_contains($grade->name, '12'));
                    
                    if ($isGrade11or12 && !$value) {
                        $fail('Stream selection is required for Grade 11 and 12 sections.');
                    }
                }
            ],
        ], [
            'name.unique' => 'A section with this name already exists for this grade.',
        ]);

        Section::create([
            'grade_id' => $validated['grade_id'],
            'name' => $validated['name'],
            'gender' => $validated['gender'] ?? 'Mixed',
            'capacity' => $validated['capacity'],
            'stream_id' => $validated['stream_id'] ?? null,
        ]);

        return redirect()->route('registrar.admission.classes')->with('success', 'Section created successfully!');
    }

    // Edit Class
    public function editClass($id)
    {
        $section = Section::with('grade')->findOrFail($id);

        return Inertia::render('Registrar/Admission/EditClass', [
            'section' => $section,
            'streams' => \App\Models\Stream::select('id', 'name')->get(),
        ]);
    }

    // Update Class
    public function updateClass(Request $request, $id)
    {
        $section = Section::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'stream_id' => [
                'nullable',
                function ($attribute, $value, $fail) use ($section) {
                    $isGrade11or12 = str_contains($section->grade->name, '11') || str_contains($section->grade->name, '12');
                    
                    if ($isGrade11or12 && !$value) {
                        $fail('Stream selection is required for Grade 11 and 12 sections.');
                    }
                }
            ],
        ]);

        $section->update([
            'name' => $validated['name'],
            'capacity' => $validated['capacity'],
            'stream_id' => $validated['stream_id'] ?? null,
        ]);

        return redirect()->route('registrar.admission.classes')->with('success', 'Class updated successfully!');
    }

    // Delete Class
    public function deleteClass($id)
    {
        $section = Section::findOrFail($id);
        $section->delete();

        return redirect()->route('registrar.admission.classes')->with('success', 'Class deleted successfully!');
    }

    // Manage Subjects
    public function manageSubjects()
    {
        $subjects = Subject::with(['grade', 'stream'])->latest()->paginate(10);

        return Inertia::render('Registrar/Admission/ManageSubjects', [
            'subjects' => $subjects,
        ]);
    }

    // Create Subject Form
    public function createSubject()
    {
        $grades = Grade::all();
        $streams = Stream::all();
        $academicYear = AcademicYear::whereRaw("is_current = true")->first();
        
        return Inertia::render('Registrar/Admission/CreateSubject', [
            'grades' => $grades,
            'streams' => $streams,
            'academicYear' => $academicYear,
        ]);
    }

    // Store New Subject
    public function storeSubject(Request $request)
    {
        // Get the grade to check if it's Grade 11 or 12
        $grade = Grade::find($request->grade_id);
        $isGrade11or12 = $grade && (str_contains($grade->name, '11') || str_contains($grade->name, '12'));

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('subjects')->where(function ($query) use ($request) {
                    return $query->where('grade_id', $request->grade_id);
                }),
            ],
            'grade_id' => 'required|exists:grades,id',
            'stream_id' => $isGrade11or12 ? 'required|exists:streams,id' : 'nullable',
        ], [
            'name.unique' => 'A subject with this name already exists for this grade.',
        ]);

        DB::beginTransaction();
        try {
            // 1. Auto-generate subject code
            $subjectCode = $this->generateSubjectCode($validated['name'], $grade, $validated['stream_id'] ?? null);

            // 2. Create Subject
            $subject = Subject::create([
                'name' => $validated['name'],
                'code' => $subjectCode,
                'grade_id' => $validated['grade_id'],
                'stream_id' => $validated['stream_id'] ?? null,
            ]);

            // 3. Auto-assign subject to sections based on grade and stream
            if ($isGrade11or12) {
                // For Grades 11 & 12: Assign to sections with matching grade AND stream
                $sections = Section::where('grade_id', $validated['grade_id'])
                    ->where('stream_id', $validated['stream_id'])
                    ->get();
            } else {
                // For Grades 9 & 10: Assign to all sections of the same grade
                $sections = Section::where('grade_id', $validated['grade_id'])->get();
            }

            // 4. Insert subject assignments into grade_subject pivot table
            foreach ($sections as $section) {
                // Check if assignment already exists
                $exists = DB::table('grade_subject')
                    ->where('grade_id', $validated['grade_id'])
                    ->where('section_id', $section->id)
                    ->where('subject_id', $subject->id)
                    ->exists();

                if (!$exists) {
                    DB::statement("
                        INSERT INTO grade_subject (grade_id, section_id, subject_id, is_active, created_at, updated_at)
                        VALUES (?, ?, ?, true, ?, ?)
                    ", [
                        $validated['grade_id'],
                        $section->id,
                        $subject->id,
                        now(),
                        now()
                    ]);
                }
            }

            DB::commit();
            
            $sectionCount = $sections->count();
            $streamInfo = "";
            if ($isGrade11or12 && isset($validated['stream_id'])) {
                $stream = Stream::find($validated['stream_id']);
                $streamInfo = " ({$stream->name})";
            }
            
            return redirect()->route('registrar.admission.subjects')
                ->with('success', "Subject '{$validated['name']}' (Code: {$subjectCode}) created successfully and automatically assigned to {$sectionCount} section(s){$streamInfo}!");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create subject: ' . $e->getMessage()]);
        }
    }

    // Generate unique subject code
    private function generateSubjectCode($subjectName, $grade, $streamId = null)
    {
        // Extract first 3-4 letters from subject name (uppercase)
        $words = explode(' ', trim($subjectName));
        $prefix = '';
        
        if (count($words) > 1) {
            // Multi-word: Take first letter of each word (max 4 letters)
            foreach (array_slice($words, 0, 4) as $word) {
                $prefix .= strtoupper(substr($word, 0, 1));
            }
        } else {
            // Single word: Take first 4 letters
            $prefix = strtoupper(substr($subjectName, 0, 4));
        }

        // Add grade number
        $gradeNumber = '';
        if (preg_match('/\d+/', $grade->name, $matches)) {
            $gradeNumber = $matches[0];
        }

        // Add stream code if applicable
        $streamCode = '';
        if ($streamId) {
            $stream = Stream::find($streamId);
            if ($stream) {
                // N for Natural, S for Social
                $streamCode = strtoupper(substr($stream->name, 0, 1));
            }
        }

        // Build base code: PREFIX-GRADE-STREAM (e.g., MATH-10, PHYS-11-N, HIST-12-S)
        $baseCode = $prefix . '-' . $gradeNumber;
        if ($streamCode) {
            $baseCode .= '-' . $streamCode;
        }

        // Check for uniqueness and add number suffix if needed
        $code = $baseCode;
        $counter = 1;
        while (Subject::where('code', $code)->exists()) {
            $code = $baseCode . '-' . $counter;
            $counter++;
        }

        return $code;
    }

    // Edit Subject
    public function editSubject($id)
    {
        $subject = Subject::findOrFail($id);
        $grades = Grade::all();

        return Inertia::render('Registrar/Admission/EditSubject', [
            'subject' => $subject,
            'grades' => $grades,
        ]);
    }

    // Update Subject
    public function updateSubject(Request $request, $id)
    {
        $subject = Subject::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:subjects,code,' . $id,
            'grade_id' => 'nullable|exists:grades,id',
        ]);

        $subject->update($validated);

        return redirect()->route('registrar.admission.subjects')->with('success', 'Subject updated successfully!');
    }

    // Delete Subject
    public function deleteSubject($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return redirect()->route('registrar.admission.subjects')->with('success', 'Subject deleted successfully!');
    }

    // Subject Combination
    public function subjectCombination()
    {
        $grades = Grade::with('sections')->get();
        $subjects = Subject::all();
        
        // Get existing subject assignments with status
        $assignments = DB::table('grade_subject')
            ->join('grades', 'grade_subject.grade_id', '=', 'grades.id')
            ->join('sections', 'grade_subject.section_id', '=', 'sections.id')
            ->join('subjects', 'grade_subject.subject_id', '=', 'subjects.id')
            ->select(
                'grade_subject.id',
                'grades.name as grade_name',
                'sections.name as section_name',
                'subjects.name as subject_name',
                'grade_subject.is_active',
                'grade_subject.grade_id',
                'grade_subject.section_id',
                'grade_subject.subject_id'
            )
            ->get();

        return Inertia::render('Registrar/Admission/SubjectCombination', [
            'grades' => $grades,
            'subjects' => $subjects,
            'assignments' => $assignments,
        ]);
    }

    // Assign Subjects to Class
    public function assignSubjects(Request $request)
    {
        $validated = $request->validate([
            'grade_id' => 'required|exists:grades,id',
            'section_id' => 'required|exists:sections,id',
            'subject_ids' => 'required|array',
            'subject_ids.*' => 'exists:subjects,id',
        ]);

        DB::beginTransaction();
        try {
            foreach ($validated['subject_ids'] as $subjectId) {
                // Check if assignment already exists
                $exists = DB::table('grade_subject')
                    ->where('grade_id', $validated['grade_id'])
                    ->where('section_id', $validated['section_id'])
                    ->where('subject_id', $subjectId)
                    ->exists();

                if (!$exists) {
                    DB::table('grade_subject')->insert([
                        'grade_id' => $validated['grade_id'],
                        'section_id' => $validated['section_id'],
                        'subject_id' => $subjectId,
                        'is_active' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            DB::commit();
            return redirect()->route('registrar.admission.subject-combination')->with('success', 'Subjects assigned successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to assign subjects: ' . $e->getMessage()]);
        }
    }

    // Toggle Subject Status
    public function toggleSubjectStatus($id)
    {
        $assignment = DB::table('grade_subject')->where('id', $id)->first();
        
        if ($assignment) {
            DB::table('grade_subject')
                ->where('id', $id)
                ->update([
                    'is_active' => !$assignment->is_active,
                    'updated_at' => now(),
                ]);

            return redirect()->route('registrar.admission.subject-combination')
                ->with('success', 'Subject status updated successfully!');
        }

        return back()->withErrors(['error' => 'Assignment not found']);
    }

    // Delete Subject Assignment
    public function deleteSubjectAssignment($id)
    {
        DB::table('grade_subject')->where('id', $id)->delete();

        return redirect()->route('registrar.admission.subject-combination')
            ->with('success', 'Subject assignment deleted successfully!');
    }
}
