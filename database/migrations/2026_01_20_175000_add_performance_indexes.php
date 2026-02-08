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
        $driver = Schema::getConnection()->getDriverName();
        
        // Marks table indexes
        // Composite index for student performance queries
        // Note: semester is an enum column, not an ID
        if ($driver === 'pgsql') {
            DB::statement('CREATE INDEX IF NOT EXISTS marks_student_subject_semester_idx ON marks (student_id, subject_id, semester)');
        } else {
            DB::statement('CREATE INDEX IF NOT EXISTS marks_student_subject_semester_idx ON marks (student_id, subject_id, semester)');
        }

        // Academic years table indexes
        if (Schema::hasColumn('academic_years', 'is_current')) {
            if ($driver === 'pgsql') {
                DB::statement('CREATE INDEX IF NOT EXISTS academic_years_is_current_index ON academic_years (is_current)');
                DB::statement('CREATE INDEX IF NOT EXISTS academic_years_status_index ON academic_years (status)');
            } else {
                DB::statement('CREATE INDEX IF NOT EXISTS academic_years_is_current_index ON academic_years (is_current)');
                DB::statement('CREATE INDEX IF NOT EXISTS academic_years_status_index ON academic_years (status)');
            }
        }
        
        // Enrollments
        if (Schema::hasTable('enrollments')) {
            if ($driver === 'pgsql') {
                DB::statement('CREATE INDEX IF NOT EXISTS enrollments_composite_idx ON enrollments (student_id, section_id, academic_year_id)');
            } else {
                DB::statement('CREATE INDEX IF NOT EXISTS enrollments_composite_idx ON enrollments (student_id, section_id, academic_year_id)');
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();
        
        if ($driver === 'pgsql') {
            DB::statement('DROP INDEX IF EXISTS users_role_index');
            DB::statement('DROP INDEX IF EXISTS marks_student_subject_semester_idx');
            DB::statement('DROP INDEX IF EXISTS academic_years_is_current_index');
            DB::statement('DROP INDEX IF EXISTS academic_years_status_index');
            DB::statement('DROP INDEX IF EXISTS semesters_number_index');
            DB::statement('DROP INDEX IF EXISTS enrollments_composite_idx');
        } else {
            DB::statement('DROP INDEX IF EXISTS users_role_index');
            DB::statement('DROP INDEX IF EXISTS marks_student_subject_semester_idx');
            DB::statement('DROP INDEX IF EXISTS academic_years_is_current_index');
            DB::statement('DROP INDEX IF EXISTS academic_years_status_index');
            DB::statement('DROP INDEX IF EXISTS semesters_number_index');
            DB::statement('DROP INDEX IF EXISTS enrollments_composite_idx');
        }
    }
};
