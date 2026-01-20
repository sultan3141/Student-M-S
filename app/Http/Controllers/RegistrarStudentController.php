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
    public function create()
    {
        return inertia('Registrar/CreateStudent', [
            'grades' => Grade::select('id', 'name', 'level')->orderBy('level')->get(),
            // Pass any other necessary data like available streams or sections if needed 
            // though sections usually depend on grade selection (can fetch via API or load all if small)
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

            // Parent Details (Mixed logic: Select Existing OR Create New)
            'parent_mode' => 'required|in:existing,new',

            // If New Parent
            'parent_name' => 'required_if:parent_mode,new|nullable|string|max:255',
            'parent_email' => 'required_if:parent_mode,new|nullable|email|unique:users,email',
            'parent_phone' => 'required_if:parent_mode,new|nullable|string|max:20',

            // If Existing Parent
            'parent_id' => 'required_if:parent_mode,existing|nullable|exists:parent_profiles,id',
        ]);

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
            // Logic: Find sections for this grade. Use one with least students or specific logic.
            // For now, simple round-robin or first available.
            $section = $this->assignSection($validated['grade_id'], $validated['gender']);

            // 4. Generate Student ID
            $studentId = $this->generateStudentId($validated['grade_id']);

            // 5. Create Student Notification
            Student::create([
                'user_id' => $studentUser->id,
                'student_id' => $studentId,
                'gender' => $validated['gender'],
                'dob' => $validated['dob'],
                'parent_id' => $parentId,
                'grade_id' => $validated['grade_id'],
                'section_id' => $section->id,
                // 'previous_school' => $validated['previous_school'], // If column exists
            ]);

            return redirect()->route('registrar.dashboard')->with('success', "Student $studentId registered successfully.");
        });
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

    private function assignSection($gradeId, $gender)
    {
        // Try to find section with gender preference first if any, or just any section
        // In a real app, check capacity.
        $section = Section::where('grade_id', $gradeId)
            ->where('gender', $gender) // If sections are gendered
            ->first();

        if (!$section) {
            $section = Section::where('grade_id', $gradeId)->first();
        }

        if (!$section) {
            // Fallback: This is critical. Should probably fail or create a "Pending" section.
            // For now, fail hard or assume seeded.
            throw new \Exception("No sections available for this grade.");
        }

        return $section;
    }

    private function generateStudentId($gradeId)
    {
        $year = date('Y');
        $grade = Grade::find($gradeId);
        $level = $grade ? $grade->level : 'XX';

        // Format: YYYY-GR-SEQUENCE (e.g., 2025-10-0042)
        // Find last ID to increment
        $lastStudent = Student::where('student_id', 'like', "$year-$level-%")->orderBy('id', 'desc')->first();

        $nextSeq = 1;
        if ($lastStudent) {
            $parts = explode('-', $lastStudent->student_id);
            if (count($parts) === 3) {
                $nextSeq = intval($parts[2]) + 1;
            }
        }

        return "$year-$level-" . str_pad($nextSeq, 4, '0', STR_PAD_LEFT);
    }
}
