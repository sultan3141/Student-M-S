<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Users table indexes
        // username already unique
        // role column does not exist (using Spatie permissions)

        // Students table indexes
        // student_id is unique so it already has an index
        // admission_number does not exist

        // Marks table indexes
        // Composite index for student performance queries
        // Note: semester is an enum column, not an ID
        DB::statement('CREATE INDEX IF NOT EXISTS marks_student_subject_semester_idx ON marks (student_id, subject_id, semester)');

        // Academic years table indexes
        if (Schema::hasColumn('academic_years', 'is_current')) {
            DB::statement('CREATE INDEX IF NOT EXISTS academic_years_is_current_index ON academic_years (is_current)');
            DB::statement('CREATE INDEX IF NOT EXISTS academic_years_status_index ON academic_years (status)');
        }
        
        // Semesters
        // Table does not exist (semesters are handled as enums or implicitly)
        
        // Enrollments
        if (Schema::hasTable('enrollments')) {
            DB::statement('CREATE INDEX IF NOT EXISTS enrollments_composite_idx ON enrollments (student_id, section_id, academic_year_id)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS users_role_index');
        // students_admission_number_index was never created
        DB::statement('DROP INDEX IF EXISTS marks_student_subject_semester_idx');
        DB::statement('DROP INDEX IF EXISTS academic_years_is_current_index');
        DB::statement('DROP INDEX IF EXISTS academic_years_status_index');
        DB::statement('DROP INDEX IF EXISTS semesters_number_index');
        DB::statement('DROP INDEX IF EXISTS enrollments_composite_idx');
    }
};
