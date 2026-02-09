<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\ParentProfile;
use App\Models\Section;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class RegistrarStudentController extends Controller
{
    /**
     * Display a listing of all students with their credentials
     */
    public function index(Request $request)
    {
        $query = Student::query()
            ->select(['id', 'user_id', 'grade_id', 'section_id', 'student_id', 'gender'])
            ->with([
                'user:id,name,username,email',
                'grade:id,name',
                'section:id,name',
                'parents.user:id,name'
            ]);

        // Search functionality
        if ($request->has('search') && $request->input('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })->orWhere('student_id', 'like', "%{$search}%");
            });
        }

        // Filter by grade
        if ($request->has('grade_id') && $request->grade_id) {
            $query->where('grade_id', $request->grade_id);
        }

        $students = $query->orderBy('student_id')
            ->paginate(15)
            ->withQueryString();

        // Get grades for filter dropdown
        $grades = Grade::select('id', 'name')->orderBy('level')->get();

        return inertia('Registrar/Students/Index', [
            'students' => $students,
            'grades' => $grades,
            'filters' => $request->only(['search', 'grade_id']),
        ]);
    }

    /**
     * Delete a student and their user account
     */
    public function destroy($id)
    {
        try {
            $student = Student::with('user')->findOrFail($id);
            $studentName = $student->user->name;
            $studentId = $student->student_id;

            DB::transaction(function () use ($student) {
                // Remove parent-student relationships
                $student->parents()->detach();

                // Delete student record
                $student->delete();

                // Delete user account
                $student->user->delete();
            });

            return redirect()->back()->with('success', "Student {$studentName} ({$studentId}) has been deleted successfully.");
        } catch (\Exception $e) {
            \Log::error('Student deletion error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete student: ' . $e->getMessage());
        }
    }
    public function create()
    {
        return inertia('Registrar/CreateStudent', [
            'grades' => Grade::select('id', 'name', 'level')->orderBy('level')->get(),
            'streams' => \App\Models\Stream::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // Student Details
            'name' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female',
            'dob' => 'nullable|date',
            'grade_id' => 'required|exists:grades,id',
            'previous_school' => 'nullable|string|max:255',
            'stream_id' => [
                'nullable',
                function ($attribute, $value, $fail) use ($request) {
                    $grade = Grade::find($request->grade_id);
                    $isGrade11or12 = $grade && (str_contains($grade->name, '11') || str_contains($grade->name, '12'));

                    if ($isGrade11or12 && !$value) {
                        $fail('Stream selection is required for Grade 11 and 12 students.');
                    }
                }
            ],

            // Parent Details (Mixed logic: Select Existing OR Create New)
            'parent_mode' => 'required|in:existing,new',

            // If New Parent
            'parent_name' => 'required_if:parent_mode,new|nullable|string|max:255',
            'parent_email' => 'required_if:parent_mode,new|nullable|email|unique:users,email',
            'parent_phone' => 'required_if:parent_mode,new|nullable|string|max:20',

            // If Existing Parent
            'parent_id' => 'required_if:parent_mode,existing|nullable|exists:parent_profiles,id',
        ]);

        try {
            return DB::transaction(function () use ($validated) {
                // 1. Resolve Parent
                $parentId = null;
                $parentProfile = null;

                if ($validated['parent_mode'] === 'existing') {
                    $parentProfile = ParentProfile::findOrFail($validated['parent_id']);
                    $parentId = $parentProfile->id;
                } else {
                    // Create New Parent User
                    $parentUser = User::create([
                        'name' => $validated['parent_name'],
                        'email' => $validated['parent_email'],
                        'password' => Hash::make('password'), // Default password, should be emailed or set
                        'username' => $this->generateUsername($validated['parent_name'], 'parent'),
                    ]);
                    $parentUser->assignRole('parent');

                    $parentProfile = ParentProfile::create([
                        'user_id' => $parentUser->id,
                        'phone' => $validated['parent_phone'],
                    ]);
                    $parentId = $parentProfile->id;
                }

                // 2. Create Student User
                $studentBaseUsername = $this->generateUsername($validated['name'], 'student');
                $studentUser = User::create([
                    'name' => $validated['name'],
                    'email' => $studentBaseUsername . '@student.ipsms.edu', // Clean email gen
                    'username' => $studentBaseUsername,
                    'password' => Hash::make('password'),
                ]);
                $studentUser->assignRole('student');

                // 3. Resolve Section (Auto-balance or Default)
                $section = $this->assignSection($validated['grade_id'], $validated['gender'], $validated['stream_id'] ?? null);

                // 4. Generate Student ID
                $studentId = $this->generateStudentId();

                // 5. Create Student Record
                $student = Student::create([
                    'user_id' => $studentUser->id,
                    'student_id' => $studentId,
                    'gender' => $validated['gender'],
                    'dob' => $validated['dob'],
                    'grade_id' => $validated['grade_id'],
                    'section_id' => $section->id,
                    'stream_id' => $validated['stream_id'] ?? null,
                ]);

                // 6. Link Student to Parent via pivot table
                if ($parentProfile) {
                    $parentProfile->students()->attach($student->id);
                }

                return redirect()->route('registrar.dashboard')->with('success', "Student $studentId registered successfully and linked to guardian.");
            });
        } catch (\Exception $e) {
            \Log::error('Student registration error: ' . $e->getMessage());
            return back()->withInput()->withErrors(['general' => 'Failed to register student: ' . $e->getMessage()]);
        }
    }

    // API Endpoint to search parents
    public function searchParents(Request $request)
    {
        $query = $request->input('query');
        if (!$query || strlen($query) < 2)
            return response()->json([]);

        $parents = ParentProfile::with('user')
            ->whereHas('user', function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('email', 'like', "%{$query}%");
            })
            ->orWhere('phone', 'like', "%{$query}%")
            ->limit(10)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->user->name,
                    'email' => $p->user->email,
                    'phone' => $p->phone
                ];
            });

        return response()->json($parents);
    }

    private function generateUsername($name, $role)
    {
        // Simple generator: firstname.lastname
        $parts = explode(' ', strtolower(trim($name)));
        $base = $parts[0] . (isset($parts[1]) ? '.' . $parts[1] : '');
        $base = preg_replace('/[^a-z0-9.]/', '', $base);

        // Ensure unique
        $count = User::where('username', 'like', "$base%")->count();
        return $count > 0 ? "$base" . ($count + 1) : $base;
    }

    private function assignSection($gradeId, $gender, $streamId = null)
    {
        // Smart auto-assignment algorithm with random selection:
        // 1. Find sections matching grade (and stream for Grade 11/12)
        // 2. Prefer gender-specific sections (Male/Female) over Mixed
        // 3. Check capacity limits
        // 4. Randomly select from available sections

        // Get all sections for this grade with current student count
        $query = Section::where('grade_id', $gradeId);

        // For Grade 11/12, filter by stream
        if ($streamId) {
            $query->where('stream_id', $streamId);
        }

        $sections = $query->withCount('students')->get();

        if ($sections->isEmpty()) {
            throw new \Exception("No sections available for this grade.");
        }

        // Priority 1: Gender-specific sections (Male/Female) that match student gender
        $genderSpecificSections = $sections->filter(function ($section) use ($gender) {
            return $section->gender === $gender && $section->students_count < $section->capacity;
        });

        if ($genderSpecificSections->isNotEmpty()) {
            return $genderSpecificSections->random(); // Random selection
        }

        // Priority 2: Mixed sections with available capacity
        $mixedSections = $sections->filter(function ($section) {
            return $section->gender === 'Mixed' && $section->students_count < $section->capacity;
        });

        if ($mixedSections->isNotEmpty()) {
            return $mixedSections->random(); // Random selection
        }

        // If we reach here, no suitable sections are available
        throw new \Exception("No available sections found. All compatible sections (" . ($gender ?? 'Any') . " or Mixed) for this grade/stream are at full capacity.");
    }

    private function generateStudentId()
    {
        $year = date('y'); // 2 digits

        // Format: SEQUENCE/YY (e.g., 0001/26)
        // Find last ID ending with /YY
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
}
