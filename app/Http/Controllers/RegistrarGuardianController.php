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
        $query = ParentProfile::with(['user', 'students']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            })->orWhereHas('students.user', function($q) use ($search) {
                // Search by linked student name as well
                 $q->where('name', 'like', "%{$search}%");
            });
        }

        $guardians = $query->paginate(12)->withQueryString();

        return inertia('Registrar/Guardians/Index', [
            'guardians' => $guardians,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Link a student to a guardian.
     */
    public function link(Request $request)
    {
        $validated = $request->validate([
            'guardian_id' => 'required|exists:parents,id',
            'student_id' => 'required|exists:students,id',
            'relationship' => 'required|string',
        ]);

        $guardian = ParentProfile::findOrFail($validated['guardian_id']);
        
        // Check if already linked
        if (!$guardian->students()->where('student_id', $validated['student_id'])->exists()) {
             // Pivot table Logic (assuming pivot has no extra columns or just minimal)
             // If pivot has 'relationship', we add it. 
             // Current migration might not have relationship column on pivot, so just attach for now.
             // If relationship is needed on pivot, we need migration. For now simpler attach.
            $guardian->students()->attach($validated['student_id']);
        }

        return redirect()->back()->with('success', 'Student linked to guardian successfully.');
    }
}
