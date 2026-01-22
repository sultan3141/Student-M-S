<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\Grade;
use App\Models\Section;
use App\Models\AcademicYear;
use App\Models\TeacherAssignment;

class TeacherAssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create academic year
        $academicYear = AcademicYear::firstOrCreate(
            ['name' => '2025-2026'],
            [
                'start_date' => '2025-09-01',
                'end_date' => '2026-06-30',
                'is_current' => true,
                'status' => 'active', // Try lowercase
            ]
        );

        // Get existing teacher
        $teacher = Teacher::first();
        if (!$teacher) {
            echo "No teachers found. Please run TeacherSeeder first.\n";
            return;
        }

        // Get or create grades first
        $grade10 = Grade::firstOrCreate(
            ['name' => 'Grade 10'],
            ['level' => 10]
        );

        $grade11 = Grade::firstOrCreate(
            ['name' => 'Grade 11'],
            ['level' => 11]
        );

        // Get or create subjects with grade_id
        $mathSubject = Subject::firstOrCreate(
            ['name' => 'Mathematics', 'grade_id' => $grade10->id],
            ['code' => 'MATH', 'description' => 'Mathematics subject']
        );

        $physicsSubject = Subject::firstOrCreate(
            ['name' => 'Physics', 'grade_id' => $grade11->id],
            ['code' => 'PHY', 'description' => 'Physics subject']
        );

        // Get or create sections
        $sectionA = Section::firstOrCreate(
            ['name' => 'Section A', 'grade_id' => $grade10->id],
            ['capacity' => 30]
        );

        $sectionB = Section::firstOrCreate(
            ['name' => 'Section B', 'grade_id' => $grade10->id],
            ['capacity' => 30]
        );

        $section11A = Section::firstOrCreate(
            ['name' => 'Section A', 'grade_id' => $grade11->id],
            ['capacity' => 25]
        );

        // Create teacher assignments
        $assignments = [
            [
                'teacher_id' => $teacher->id,
                'subject_id' => $mathSubject->id,
                'grade_id' => $grade10->id,
                'section_id' => $sectionA->id,
                'academic_year_id' => $academicYear->id,
            ],
            [
                'teacher_id' => $teacher->id,
                'subject_id' => $mathSubject->id,
                'grade_id' => $grade10->id,
                'section_id' => $sectionB->id,
                'academic_year_id' => $academicYear->id,
            ],
            [
                'teacher_id' => $teacher->id,
                'subject_id' => $physicsSubject->id,
                'grade_id' => $grade11->id,
                'section_id' => $section11A->id,
                'academic_year_id' => $academicYear->id,
            ],
        ];

        foreach ($assignments as $assignmentData) {
            TeacherAssignment::firstOrCreate($assignmentData);
        }

        echo "Teacher assignments created successfully!\n";
        echo "Teacher '{$teacher->user->name}' has been assigned to:\n";
        echo "- Mathematics: Grade 10 Section A\n";
        echo "- Mathematics: Grade 10 Section B\n";
        echo "- Physics: Grade 11 Section A\n";
    }
}