<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\Grade;
use App\Models\Section;
use App\Models\AcademicYear;
use App\Models\TeacherAssignment;
use Illuminate\Support\Facades\DB;

class TeacherAssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create academic year
        $academicYear = AcademicYear::whereRaw('is_current = true')->first();
        if (!$academicYear) {
            $academicYear = AcademicYear::create([
                'name' => '2025-2026',
                'start_date' => '2025-09-01',
                'end_date' => '2026-06-30',
                'is_current' => DB::raw('true'),
                'status' => 'active',
            ]);
        }

        // Get existing teacher
        $teacher = Teacher::first();
        if (!$teacher) {
            echo "No teachers found. Please run TeacherSeeder first.\n";
            return;
        }

        // Get grades 9, 10, 11, 12
        $grades = Grade::whereIn('level', [9, 10, 11, 12])->get();
        
        if ($grades->isEmpty()) {
            echo "No grades found. Please run AcademicStructureSeeder first.\n";
            return;
        }

        $assignmentCount = 0;
        $subjectAssignmentCount = 0;

        foreach ($grades as $grade) {
            // Get all subjects for this grade
            $subjects = Subject::where('grade_id', $grade->id)->get();
            
            // Get all sections for this grade
            $sections = Section::where('grade_id', $grade->id)->get();
            
            if ($sections->isEmpty()) {
                echo "No sections found for {$grade->name}\n";
                continue;
            }

            foreach ($subjects as $subject) {
                // Assign subject to all sections of this grade (grade_subject pivot)
                foreach ($sections as $section) {
                    // Check if already exists in pivot table
                    $exists = DB::table('grade_subject')
                        ->where('grade_id', $grade->id)
                        ->where('subject_id', $subject->id)
                        ->where('section_id', $section->id)
                        ->exists();
                    
                    if (!$exists) {
                        DB::table('grade_subject')->insert([
                            'grade_id' => $grade->id,
                            'subject_id' => $subject->id,
                            'section_id' => $section->id,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                        $subjectAssignmentCount++;
                    }
                }

                // Assign teacher to first 2 subjects per grade for testing
                if ($subject->name === 'Mathematics' || $subject->name === 'Physics') {
                    foreach ($sections as $section) {
                        $assignment = TeacherAssignment::firstOrCreate([
                            'teacher_id' => $teacher->id,
                            'subject_id' => $subject->id,
                            'grade_id' => $grade->id,
                            'section_id' => $section->id,
                            'academic_year_id' => $academicYear->id,
                        ]);
                        
                        if ($assignment->wasRecentlyCreated) {
                            $assignmentCount++;
                        }
                    }
                }
            }
        }

        echo "\n=== Seeding Complete ===\n";
        echo "Academic Year: {$academicYear->name} (Current)\n";
        echo "Teacher: {$teacher->user->name}\n";
        echo "Subject-Section Assignments: {$subjectAssignmentCount}\n";
        echo "Teacher Assignments: {$assignmentCount}\n";
        echo "\nTeacher is assigned to Mathematics and Physics for all grades (9-12) and all sections.\n";
    }
}