<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('marks', function (Blueprint $table) {
            // Add composite indexes for faster queries
            $table->index(['student_id', 'academic_year_id'], 'marks_student_year_idx');
            $table->index(['student_id', 'semester', 'academic_year_id'], 'marks_student_sem_year_idx');
            $table->index(['section_id', 'semester', 'academic_year_id'], 'marks_section_sem_year_idx');
        });

        Schema::table('students', function (Blueprint $table) {
            // Add indexes for student lookups
            $table->index('section_id', 'students_section_idx');
            $table->index('grade_id', 'students_grade_idx');
        });

        Schema::table('semester_results', function (Blueprint $table) {
            // Add indexes for semester results
            $table->index(['student_id', 'academic_year_id'], 'sem_results_student_year_idx');
        });

        Schema::table('registrations', function (Blueprint $table) {
            // Add indexes for registrations
            $table->index(['student_id', 'academic_year_id'], 'registrations_student_year_idx');
        });
    }

    public function down(): void
    {
        Schema::table('marks', function (Blueprint $table) {
            $table->dropIndex('marks_student_year_idx');
            $table->dropIndex('marks_student_sem_year_idx');
            $table->dropIndex('marks_section_sem_year_idx');
        });

        Schema::table('students', function (Blueprint $table) {
            $table->dropIndex('students_section_idx');
            $table->dropIndex('students_grade_idx');
        });

        Schema::table('semester_results', function (Blueprint $table) {
            $table->dropIndex('sem_results_student_year_idx');
        });

        Schema::table('registrations', function (Blueprint $table) {
            $table->dropIndex('registrations_student_year_idx');
        });
    }
};
