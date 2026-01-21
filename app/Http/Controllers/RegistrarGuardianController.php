<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ParentProfile;
use App\Models\Student;
use App\Models\User;

class RegistrarGuardianController extends Controller
{
    /**
     * Display a listing of the guardians.
     */
    public function index(Request $request)
    {
        $query = ParentProfile::with(['user', 'students.user']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('phone', 'like', "%{$search}%")
              ->orWhereHas('students.user', function($q) use ($search) {
                // Search by linked student name as well
                 $q->where('name', 'like', "%{$search}%");
            });
        }

        $guardians = $query->paginate(12)->withQueryString();

        // Get available students for linking (only students not already linked to any parent)
        $students = Student::with('user:id,name')
            ->select('id', 'student_id', 'user_id')
            ->whereNotExists(function($query) {
                $query->select(\DB::raw(1))
                      ->from('parent_student')
                      ->whereRaw('parent_student.student_id = students.id');
            })
            ->orderBy('student_id')
            ->get()
            ->map(function($student) {
                return [
                    'id' => $student->id,
                    'student_id' => $student->student_id,
                    'name' => $student->user->name ?? 'Unknown',
                ];
            });

        // Debug: Log the guardian data to see what's being passed
        \Log::info('Guardian data being passed to frontend:', [
            'guardian_count' => $guardians->count(),
            'first_guardian_students' => $guardians->first() ? $guardians->first()->students->count() : 0
        ]);

        return inertia('Registrar/Guardians/Index', [
            'guardians' => $guardians,
            'students' => $students,
            'filters' => $request->only(['search']),
            'csrf_token' => csrf_token(),
        ]);
    }

    /**
     * Show the form for creating a new guardian.
     */
    public function create()
    {
        return inertia('Registrar/Guardians/Create');
    }

    /**
     * Store a newly created guardian in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
        ]);

        // Generate username from name (e.g., "John Doe" -> "parent_john_doe")
        $baseUsername = 'parent_' . strtolower(str_replace(' ', '_', $validated['name']));
        $username = $baseUsername;
        
        // Ensure username is unique
        $counter = 1;
        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . '_' . $counter;
            $counter++;
        }

        // Generate a random password (8 characters)
        $password = $this->generatePassword();

        // Create user account
        $user = User::create([
            'name' => $validated['name'],
            'username' => $username,
            'email' => $validated['email'],
            'password' => \Hash::make($password),
        ]);

        // Assign parent role
        $user->assignRole('parent');

        // Create parent profile
        $parentProfile = ParentProfile::create([
            'user_id' => $user->id,
            'phone' => $validated['phone'],
            'address' => $validated['address'],
        ]);

        // Return with success message including credentials
        return redirect()->route('registrar.guardians.index')->with([
            'success' => 'Guardian account created successfully!',
            'credentials' => [
                'name' => $validated['name'],
                'username' => $username,
                'password' => $password,
            ]
        ]);
    }

    /**
     * Generate a random password.
     */
    private function generatePassword($length = 8)
    {
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $password = '';
        
        for ($i = 0; $i < $length; $i++) {
            $password .= $characters[rand(0, strlen($characters) - 1)];
        }
        
        return $password;
    }

    /**
     * Reset guardian password.
     */
    public function resetPassword($id)
    {
        $parentProfile = ParentProfile::findOrFail($id);
        $user = $parentProfile->user;

        // Generate new password
        $newPassword = $this->generatePassword();
        
        $user->update([
            'password' => \Hash::make($newPassword),
        ]);

        return redirect()->back()->with([
            'success' => 'Password reset successfully!',
            'credentials' => [
                'name' => $user->name,
                'username' => $user->username,
                'password' => $newPassword,
            ]
        ]);
    }

    /**
     * Link a student to a guardian.
     */
    public function link(Request $request)
    {
        try {
            $validated = $request->validate([
                'guardian_id' => 'required|exists:parents,id',
                'student_id' => 'required|string',
                'relationship' => 'required|string',
            ]);

            $guardian = ParentProfile::findOrFail($validated['guardian_id']);
            
            // Find student by student_id (registration number) instead of database id
            $student = Student::where('student_id', $validated['student_id'])->first();
            
            if (!$student) {
                return redirect()->back()->with('error', 'Student not found with ID: ' . $validated['student_id']);
            }
            
            // Check if student is already linked to ANY parent (enforce one student = one parent rule)
            $existingLink = \DB::table('parent_student')->where('student_id', $student->id)->first();
            if ($existingLink) {
                $existingParent = ParentProfile::find($existingLink->parent_id);
                return redirect()->back()->with('error', 'Student is already linked to another guardian: ' . ($existingParent->user->name ?? 'Unknown'));
            }
            
            // Link the student to this guardian
            $guardian->students()->attach($student->id);

            return redirect()->back()->with('success', 'Student linked to guardian successfully.');
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle database constraint violations (duplicate student links)
            if (str_contains($e->getMessage(), 'unique_student_parent')) {
                return redirect()->back()->with('error', 'This student is already linked to another guardian. Each student can only have one guardian.');
            }
            throw $e;
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            \Log::error('Guardian linking error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to link student to guardian: ' . $e->getMessage());
        }
    }

    /**
     * Unlink a student from a guardian.
     */
    public function unlink(Request $request)
    {
        \Log::info('Unlink request received', $request->all());
        
        try {
            $validated = $request->validate([
                'guardian_id' => 'required|exists:parents,id',
                'student_id' => 'required|exists:students,id',
            ]);

            \Log::info('Validation passed', $validated);

            $guardian = ParentProfile::findOrFail($validated['guardian_id']);
            
            // Remove the link
            $result = $guardian->students()->detach($validated['student_id']);
            
            \Log::info('Detach result', ['result' => $result, 'guardian_id' => $validated['guardian_id'], 'student_id' => $validated['student_id']]);

            return redirect()->back()->with('success', 'Student unlinked from guardian successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed', ['errors' => $e->errors()]);
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            \Log::error('Guardian unlinking error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to unlink student from guardian: ' . $e->getMessage());
        }
    }
}
